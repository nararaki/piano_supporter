import { seedRoles } from "./seedRoles.ts";
import { seedComposersAndMusics } from "./seedComposersAndMusics.ts";
import { seedMusicXmlToS3 } from "./seedMusicXmlToS3.ts";
/**
 * すべてのseedデータを実行
 */
const runSeeds = async () => {
	try {
		console.log("seed[roles]データの挿入を開始します...");
		await seedRoles();
		console.log("seed[roles]データの挿入が完了しました");
		console.log("seed[composers and musics]データの挿入を開始します...");
		const result = await seedComposersAndMusics();
		if (!result.ok) {
			console.error("seed[composers and musics]データの挿入に失敗しました:", result.error);
			process.exit(1);
		}
		console.log("seed[composers and musics]データの挿入が完了しました");
		console.log("seed[music XML to S3]データのアップロードを開始します...");
		const xmlResult = await seedMusicXmlToS3();
		if (!xmlResult.ok) {
			console.error("seed[music XML to S3]データのアップロードに失敗しました:", xmlResult.error);
			process.exit(1);
		}
		console.log("seed[music XML to S3]データのアップロードが完了しました");
		process.exit(0);
	} catch (error) {
		console.error("seedデータの挿入中にエラーが発生しました:", error);
		process.exit(1);
	}
};

runSeeds();

