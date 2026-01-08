import { err, ok } from "@piano_supporter/common/lib/error.js";
import { db } from "../../../infrastructure/db/initial.ts";
import { music } from "../../../infrastructure/db/schema/music.ts";
import { newS3XmlUploader } from "../sheet/uploadxmlTos3.ts";
import fs from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";

/**
 * JSONファイルを読み込んで、xmlFileNameが設定されているmusicのXMLをS3にアップロードし、DBにURLを保存
 */
export const seedMusicXmlToS3 = async () => {
	try {
		const uploader = newS3XmlUploader;
		const dataDir = path.join(process.cwd(), "..", "..", "data");
		console.log(`[seedMusicXmlToS3] dataDir: ${dataDir}`);
		const mappingFilePath = path.join(process.cwd(), "src", "util", "seed", "sheet", "music-xml-mapping.json");
		
		console.log(`[seedMusicXmlToS3] マッピングファイルを確認: ${mappingFilePath}`);

		// マッピングファイルを読み込む
		let mappings: Array<{ id: string; title: string; xmlFileName: string }>;
		try {
			const mappingContent = await fs.readFile(mappingFilePath, "utf-8");
			mappings = JSON.parse(mappingContent);
		} catch {
			return err({
				type: "NOT_FOUND",
				message: `マッピングファイルが見つかりません: ${mappingFilePath}。先にseedComposersAndMusicsを実行してください`,
			});
		}

		// xmlFileNameが設定されているものだけをフィルタ
		const mappingsWithXml = mappings.filter((m) => m.xmlFileName && m.xmlFileName.trim() !== "");

		if (mappingsWithXml.length === 0) {
			return err({
				type: "NOT_FOUND",
				message: "xmlFileNameが設定されているmusicが見つかりません。music-xml-mapping.jsonでxmlFileNameを設定してください",
			});
		}

		console.log(`[seedMusicXmlToS3] ${mappingsWithXml.length}件のXMLファイルマッピングを発見`);

		let successCount = 0;
		let errorCount = 0;

		// 各マッピングを処理
		for (const mapping of mappingsWithXml) {
			const xmlFileName = mapping.xmlFileName.trim();
			const filePath = path.join(dataDir, xmlFileName);

			// ファイルの存在確認
			try {
				await fs.access(filePath);
			} catch {
				console.warn(
					`[seedMusicXmlToS3] XMLファイルが見つかりません: ${filePath} (musicId: ${mapping.id}, title: ${mapping.title})`,
				);
				errorCount++;
				continue;
			}

			console.log(
				`[seedMusicXmlToS3] ${xmlFileName} -> musicId: ${mapping.id}, title: ${mapping.title}`,
			);

			// S3にアップロード
			const uploadResult = await uploader.uploadXmlFile(
				filePath,
				mapping.id,
				xmlFileName,
			);

			if (!uploadResult.ok) {
				console.error(
					`[seedMusicXmlToS3] ${xmlFileName}のアップロードに失敗: ${uploadResult.error.message}`,
				);
				errorCount++;
				continue;
			}

			const s3Url = uploadResult.value;

			// DBのsheetMusicUrlを更新
			await db
				.update(music)
				.set({ sheetMusicUrl: s3Url })
				.where(eq(music.id, mapping.id))
				.execute();

			console.log(
				`[seedMusicXmlToS3] ${xmlFileName}のアップロードとDB更新が完了: ${s3Url}`,
			);
			successCount++;
		}

		return ok({
			message: `XMLファイルのアップロードが完了しました（成功: ${successCount}, 失敗: ${errorCount}）`,
			successCount,
			errorCount,
		});
	} catch (error) {
		return err({
			type: "UNEXPECTED",
			message: `XMLファイルのアップロード処理に失敗しました: ${error}`,
		});
	}
};