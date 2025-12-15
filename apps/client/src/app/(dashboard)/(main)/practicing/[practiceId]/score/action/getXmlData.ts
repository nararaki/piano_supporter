"use server";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import fs from "node:fs/promises";
import path from "node:path";

const SCORE_PATH = path.join(process.cwd(), 'data', 'K545-1.xml');
export const getXmlData = async (): Promise<Result<string>> => {
    try {
        const xmlContent = await fs.readFile(SCORE_PATH, 'utf-8');
        return ok(xmlContent);
    } catch (error) {
        console.error(error);
        return err({
            type: "NOT_FOUND",
            message: "楽譜が見つかりません",
        });
    }
}