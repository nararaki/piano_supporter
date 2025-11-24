import { seedRoles } from "./seedRoles.ts";

/**
 * すべてのseedデータを実行
 */
const runSeeds = async () => {
	try {
		console.log("seedデータの挿入を開始します...");
		await seedRoles();
		console.log("seedデータの挿入が完了しました");
		process.exit(0);
	} catch (error) {
		console.error("seedデータの挿入中にエラーが発生しました:", error);
		process.exit(1);
	}
};

runSeeds();

