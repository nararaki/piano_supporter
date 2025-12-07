import { seedRoles } from "./seedRoles.ts";
import { seedComposers } from "./seedComposers.ts";
/**
 * すべてのseedデータを実行
 */
const runSeeds = async () => {
	try {
		console.log("seed[roles]データの挿入を開始します...");
		await seedRoles();
		console.log("seed[roles]データの挿入が完了しました");
		console.log("seed[composers]データの挿入を開始します...");
		await seedComposers();
		console.log("seed[composer]データの挿入が完了しました");
		process.exit(0);
	} catch (error) {
		console.error("seedデータの挿入中にエラーが発生しました:", error);
		process.exit(1);
	}
};

runSeeds();

