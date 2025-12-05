import { db } from "../initial.ts";

/**
 * すべてのseedデータを実行
 */
const runClear = async () => {
	try {
		console.log("データベースを初期化します...");
        await db.execute("DROP DATABASE IF EXISTS piano_supporter;");
        await db.execute("CREATE DATABASE piano_supporter;");
        console.log("データベースを初期化しました");
		process.exit(0);
	} catch (error) {
		console.error("seedデータの挿入中にエラーが発生しました:", error);
		process.exit(1);
	}
};

runClear();
