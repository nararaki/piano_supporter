import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import type { MediaStorage } from "src/infrastructure/s3/mediaStorage.ts";

interface EditXmlData {
	xmlUrl: string;
	directionContent: string;
	outputKey?: string; // S3のキー（省略時は元のURLから推測）
}

export class XmlEditService {
	constructor(private mediaStorage: MediaStorage) {}

	private createDirection(content: string) {
		return {
			"@_placement": "above",
			"direction-type": {
				words: content,
			},
		};
	}

	async exec(data: EditXmlData): Promise<Result<string>> {
		// XMLデータを取得
		const xmlBufferResult = await this.mediaStorage.get(data.xmlUrl);
		if (!xmlBufferResult.ok) {
			return err({
				type: "NOT_FOUND",
				message: "楽譜が見つかりません",
			});
		}

		const xmlString = xmlBufferResult.value.toString("utf-8");

		// XMLをパース
		const parser = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: "@_",
			preserveOrder: true,
		});

		const json = parser.parse(xmlString);

		// rootを探す
		const rootObj = json.find((i: Record<string, unknown>) => i["score-partwise"]);
		if (!rootObj) {
			return err({ type: "UNEXPECTED", message: "Invalid MusicXML" });
		}

		// partを探す
		const parts = (rootObj["score-partwise"] as Array<Record<string, unknown>>).filter(
			(i: Record<string, unknown>) => i.part,
		);
		const firstPart = (parts[0]?.part as Array<Record<string, unknown>>) || []; // これも配列

		// measureを探す (firstPart配列の中から measure を持つものを探す)
		const firstMeasureObj = firstPart.find((i: Record<string, unknown>) => {
			if (!i.measure) return false;
			const measure = Array.isArray(i.measure) ? i.measure[0] : i.measure;
			const measureWithAttrs = measure as Record<string, unknown>;
			const attrs = measureWithAttrs[":@"] as Record<string, unknown> | undefined;
			return attrs?.["@_number"] === "1";
		}) as Record<string, unknown> | undefined;

		if (firstMeasureObj?.measure) {
			// 順番を崩さず direction を追加
			// 配列の先頭（または適切な場所）に direction ノードを挿入する
			const measureArray = Array.isArray(firstMeasureObj.measure)
				? firstMeasureObj.measure
				: [firstMeasureObj.measure];
			measureArray.unshift({
				direction: [this.createDirection(data.directionContent)],
			});
			firstMeasureObj.measure = measureArray;
		}

		// ビルド
		const builder = new XMLBuilder({
			ignoreAttributes: false,
			preserveOrder: true, // パース時と同じ設定にする
			format: true,
			suppressEmptyNode: true,
		});

		let xml = builder.build(json);
		const declaration = '<?xml version="1.0" encoding="UTF-8"?>\n';
		const doctype =
			'<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n';

		// build結果に宣言が含まれていない場合は手動で足す
		if (!xml.startsWith("<?xml")) {
			xml = declaration + doctype + xml;
		}

		// S3のキーを決定（outputKeyが指定されていない場合は元のURLから推測）
		const s3Key = data.outputKey || this.mediaStorage.extractKeyFromUrl(data.xmlUrl);
        if(!s3Key) {
            return err({
                type: "UNEXPECTED",
                message: "Invalid XML URL",
            });
        }

		// S3に保存
		const xmlBuffer = Buffer.from(xml, "utf-8");
		const putResult = await this.mediaStorage.put(s3Key, xmlBuffer, "application/xml");
		if (!putResult.ok) {
			return err({
				type: "SERVER_ERROR",
				message: "XMLの書き込みに失敗しました",
			});
		}

		const cloudFrontUrl = this.mediaStorage.getCloudFrontUrl(s3Key);
		return ok(cloudFrontUrl);
	}
}