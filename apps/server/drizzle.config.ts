import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
	dialect: "mysql",
	schema: "./src/infrastructure/db/schema",
	out: "./drizzle",
	dbCredentials: {
		user: process.env.MYSQL_ROOT_USER,
		password: process.env.MYSQL_ROOT_PASSWORD,
		host: String(process.env.MYSQL_HOST),
		port: Number(process.env.MYSQL_PORT),
		database: String(process.env.MYSQL_DATABASE),
	},
});
