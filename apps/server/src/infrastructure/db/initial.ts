import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

dotenv.config();
const connection = await mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_ROOT_USER,
	database: process.env.MYSQL_DATABASE,
	password: process.env.MYSQL_ROOT_PASSWORD,
	port: Number(process.env.MYSQL_PORT),
});

export const db = drizzle(connection);
