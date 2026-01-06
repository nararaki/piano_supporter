import { seedMusicXmlToS3 } from "./seedMusicXmlToS3.ts";

/**
 * XMLファイルのS3アップロードのみを実行
 */
const runXmlSeed = async () => {
	try {
		console.log("seed[music XML to S3]データのアップロードを開始します...");
		const xmlResult = await seedMusicXmlToS3();
		if (!xmlResult.ok) {
			console.error("seed[music XML to S3]データのアップロードに失敗しました:", xmlResult.error);
			process.exit(1);
		}
		console.log("seed[music XML to S3]データのアップロードが完了しました");
		process.exit(0);
	} catch (error) {
		console.error("seedデータのアップロード中にエラーが発生しました:", error);
		process.exit(1);
	}
};

runXmlSeed();

