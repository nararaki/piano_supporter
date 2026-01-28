import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import type { MediaStorage } from "src/infrastructure/s3/mediaStorage.ts";

interface EditXmlData {
    xmlUrl: string;
    directionContent: string;
    sectionNumber: number;
    timePosition: number;
    outputKey?: string;
}

export class XmlEditService {
    constructor(private mediaStorage: MediaStorage) {}

    // OSMDで表示させるための強力な設定（位置、フォントサイズ指定）
    private createDirection(content: string, staff: number = 1) {
        return {
            "direction": [
                {
                    "direction-type": [
                        {
                            "words": [
                                {
                                    "#text": content,
                                    ":@": {
                                        // 変更点: default-x を追加して、少し右へずらす（小節線やコード記号との重なり回避）
                                        "@_default-x": "15", 
                                        // 変更点: default-y をさらに大きくして、コード記号の上へ逃がす (30 -> 50)
                                        "@_default-y": "50",    
                                        "@_font-size": "12",
                                        "@_font-weight": "bold"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "staff": [
                        { "#text": staff.toString() }
                    ]
                }
            ],
            ":@": {
                "@_placement": "above"
            }
        };
    }
    async exec(data: EditXmlData): Promise<Result<string>> {
        const xmlBufferResult = await this.mediaStorage.getXmlData(data.xmlUrl);
        if (!xmlBufferResult.ok) return err({ type: "NOT_FOUND", message: "Score not found" });

        const xmlString = xmlBufferResult.value.toString("utf-8");

        // Parserの設定
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_", // 属性の頭に @_ をつける設定
            preserveOrder: true,
        });

        const json = parser.parse(xmlString);

        // 1. Find root
        const rootObj = json.find((i: any) => i["score-partwise"]);
        if (!rootObj) return err({ type: "UNEXPECTED", message: "Invalid MusicXML" });

        // 2. Find parts
        const parts = (rootObj["score-partwise"] as any[]).filter((i) => i.part);
        const firstPartArray = parts[0]?.part as any[];

        if (!firstPartArray) return err({ type: "UNEXPECTED", message: "No parts found" });

        // 3. Find the correct measure
        const firstMeasureObj = firstPartArray.find((i) => {
            return i.measure && i[":@"]?.["@_number"] === data.sectionNumber.toString();
        });

        if (firstMeasureObj) {
            if (!Array.isArray(firstMeasureObj.measure)) {
                firstMeasureObj.measure = [];
            }
            const measureArray = firstMeasureObj.measure as any[];

            // 挿入位置の計算（print, attributesの後ろ）
            let insertIndex = 0;
            for (let i = 0; i < measureArray.length; i++) {
                const node = measureArray[i];
                if (node.print || node.attributes || node.barline) {
                    insertIndex = i + 1;
                } else if (node.note || node.harmony || node.direction || node.backup || node.forward) {
                    break;
                }
            }

            measureArray.splice(insertIndex, 0, this.createDirection(data.directionContent));
        }

        // 4. Build XML
        // ここが重要：Parserと同じ attributeNamePrefix を設定する
        const builder = new XMLBuilder({
            ignoreAttributes: false,
            attributeNamePrefix: "@_", // ★これがないと属性が消えることがあります
            preserveOrder: true,
            format: true,
            suppressEmptyNode: true,
        });

        let xml = builder.build(json);
        const declaration = '<?xml version="1.0" encoding="UTF-8"?>\n';
        const doctype = '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n';

        if (!xml.startsWith("<?xml")) {
            xml = declaration + doctype + xml;
        }

        const s3Key = data.outputKey || this.mediaStorage.extractKeyFromUrl(data.xmlUrl);
        if (!s3Key) return err({ type: "UNEXPECTED", message: "Invalid XML URL" });

        const putResult = await this.mediaStorage.put(s3Key, Buffer.from(xml, "utf-8"), "application/xml");
        if (!putResult.ok) return err({ type: "SERVER_ERROR", message: "Failed to write XML" });

        return ok(this.mediaStorage.getCloudFrontUrl(s3Key));
    }
}