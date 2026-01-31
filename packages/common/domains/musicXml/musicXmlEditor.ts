import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { err, ok, type Result } from "../../lib/error.js";

export interface DirectionInsertData {
    content: string;
    sectionNumber: number;
    staff?: number;
}

// MusicXML用のパーサー設定
const parserOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    preserveOrder: true,
};

// MusicXML用のビルダー設定
const builderOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    preserveOrder: true,
    format: true,
    suppressEmptyNode: true,
};

/**
 * MusicXMLのdirection要素を作成
 */
export const createDirection = (content: string, staff: number = 1) => {
    return {
        "direction": [
            {
                "direction-type": [
                    {
                        "words": [
                            {
                                "#text": content,
                                ":@": {
                                    "@_default-x": "15",
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
};

/**
 * MusicXML文字列をパースしてJSONに変換
 */
export const parseMusicXml = (xmlString: string): Result<any> => {
    const parser = new XMLParser(parserOptions);
    const json = parser.parse(xmlString);

    const rootObj = json.find((i: any) => i["score-partwise"]);
    if (!rootObj) {
        return err({ type: "UNEXPECTED", message: "Invalid MusicXML: score-partwise not found" });
    }

    return ok(json);
};

/**
 * 指定した小節にdirectionを挿入
 */
export const insertDirectionToMeasure = (
    json: any,
    data: DirectionInsertData
): Result<any> => {
    const rootObj = json.find((i: any) => i["score-partwise"]);
    if (!rootObj) {
        return err({ type: "UNEXPECTED", message: "Invalid MusicXML" });
    }

    const parts = (rootObj["score-partwise"] as any[]).filter((i) => i.part);
    const firstPartArray = parts[0]?.part as any[];

    if (!firstPartArray) {
        return err({ type: "UNEXPECTED", message: "No parts found" });
    }

    const measureObj = firstPartArray.find((i) => {
        return i.measure && i[":@"]?.["@_number"] === data.sectionNumber.toString();
    });

    if (measureObj) {
        if (!Array.isArray(measureObj.measure)) {
            measureObj.measure = [];
        }
        const measureArray = measureObj.measure as any[];

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

        measureArray.splice(insertIndex, 0, createDirection(data.content, data.staff ?? 1));
    }

    return ok(json);
};

/**
 * JSONからMusicXML文字列を構築
 */
export const buildMusicXml = (json: any): string => {
    const builder = new XMLBuilder(builderOptions);
    let xml = builder.build(json);

    const declaration = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const doctype = '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n';

    if (!xml.startsWith("<?xml")) {
        xml = declaration + doctype + xml;
    }

    return xml;
};

/**
 * MusicXMLにdirectionを追加する（一連の処理をまとめたユーティリティ）
 */
export const addDirectionToMusicXml = (
    xmlString: string,
    data: DirectionInsertData
): Result<string> => {
    const parseResult = parseMusicXml(xmlString);
    if (!parseResult.ok) return parseResult;

    const insertResult = insertDirectionToMeasure(parseResult.value, data);
    if (!insertResult.ok) return insertResult;

    return ok(buildMusicXml(insertResult.value));
};
