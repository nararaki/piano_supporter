//🦄🌈this is a pinanosupporter's hooks!!🌈🦄

import dotenv from "dotenv";
dotenv.config();

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { accountRoute, enrollSchoolRoute, schoolRoute, postsRoute, practiceRoute, composersRoute, musicsRoute, commentsRoute, taskRoute } from "./router.ts";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import fs from "node:fs/promises";

const getXmlData = async (): Promise<Result<string>> => {
    try {
		console.log(process.cwd());
        const xmlContent = await fs.readFile("../client/data/K545-1-original.xml", 'utf-8');
        return ok(xmlContent);
    } catch (error) {
        console.error(error);
        return err({
            type: "NOT_FOUND",
            message: "楽譜が見つかりません",
        });
    }
}

function createDirection(content: string) {
	return {
	  "@_placement": "above",
	  "direction-type": {
		words: content
	  }
	};
}

async function parseXmlData(): Promise<Result<string>> {
    const xmlString = await getXmlData();
	console.log(xmlString);
    if (!xmlString.ok) return err({
		type: "SERVER_ERROR",
		message: xmlString.error.message,
	});

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
		preserveOrder: true,
    });
	
	// ... パース後 ...
	const json = parser.parse(xmlString.value);

	// rootを探す
	const rootObj = json.find((i: any) => i['score-partwise']);
	if (!rootObj) return err({ type: "UNEXPECTED", message: "Invalid MusicXML" });

	// partを探す
	const parts = rootObj['score-partwise'].filter((i: any) => i.part);
	const firstPart = parts[0]?.part; // これも配列

	// measureを探す (firstPart配列の中から measure を持つものを探す)
	const firstMeasureObj = firstPart.find((i: any) => i.measure && i.measure[0]?.[':@']?.['@_number'] === "1");

	if (firstMeasureObj) {
		// 順番を崩さず direction を追加
		// 配列の先頭（または適切な場所）に direction ノードを挿入する
		firstMeasureObj.measure.unshift({
			direction: [createDirection("test")]
		});
	}

	// ビルド
	const builder = new XMLBuilder({
		ignoreAttributes: false,
		preserveOrder: true, // パース時と同じ設定にする
		format: true,
		suppressEmptyNode: true
	});

	let xml = builder.build(json);
	const declaration = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const doctype = '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n';
    
    // build結果に宣言が含まれていない場合は手動で足す
    if (!xml.startsWith('<?xml')) {
        xml = declaration + doctype + xml;
    }

    try {
		await fs.writeFile("../client/data/K545-1.xml", xml);
		return ok(xml);
	} catch (error) {
		console.error(error);
		return err({
			type: "SERVER_ERROR",
			message: "XMLの書き込みに失敗しました",
		});
	}
}

const result = await parseXmlData();
console.log(result);
export const apiRoutes = new Hono()
	.route("/account-init", accountRoute)
	.route("/school-init", schoolRoute)
	.route("/school", schoolRoute)
	.route("/enroll-school", enrollSchoolRoute)
	.route("/posts", postsRoute)
	.route("/practice", practiceRoute)
	.route("/composers", composersRoute)
	.route("/musics", musicsRoute)
	.route("/comments", commentsRoute)
	.route("/task", taskRoute);

const app = new Hono()
	.use(
		"/*",
		cors({
			origin: ["http://localhost:3000"],

			allowMethods: ["POST", "GET", "OPTIONS"],

			allowHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.get("/", (c) => {
		return c.text("Hello Hono!");
	})
	.route("/", apiRoutes);

serve(
	{
		fetch: app.fetch,
		port: 8000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);

export type AppType = typeof apiRoutes;
