import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import type { IMediaStorage } from "../../repository/media/IMediaStorage.ts";
import { addDirectionToMusicXml } from "@piano_supporter/common/domains/musicXml/musicXmlEditor.js";

interface EditXmlData {
    xmlUrl: string;
    directionContent: string;
    sectionNumber: number;
    timePosition: number;
    outputKey?: string;
}

export class XmlEditService {
    constructor(private mediaStorage: IMediaStorage) {}

    async exec(data: EditXmlData): Promise<Result<string>> {
        // 1. XMLを取得
        const xmlBufferResult = await this.mediaStorage.getXmlData(data.xmlUrl);
        if (!xmlBufferResult.ok) {
            return err({ type: "NOT_FOUND", message: "Score not found" });
        }

        const xmlString = xmlBufferResult.value.toString("utf-8");

        // 2. MusicXMLにdirectionを追加（domain service）
        const editResult = addDirectionToMusicXml(xmlString, {
            content: data.directionContent,
            sectionNumber: data.sectionNumber,
        });
        if (!editResult.ok) return editResult;

        // 3. S3に保存
        const s3Key = data.outputKey || this.mediaStorage.extractKeyFromUrl(data.xmlUrl);
        if (!s3Key) {
            return err({ type: "UNEXPECTED", message: "Invalid XML URL" });
        }

        const putResult = await this.mediaStorage.put(
            s3Key,
            Buffer.from(editResult.value, "utf-8"),
            "application/xml"
        );
        if (!putResult.ok) {
            return err({ type: "SERVER_ERROR", message: "Failed to write XML" });
        }

        return ok(this.mediaStorage.getCloudFrontUrl(s3Key));
    }
}
