"use server";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { getPracticeById } from "@/infrastructure/api/practice";

export const getXmlData = async (practiceId: string): Promise<Result<string>> => {
    try {
        // Practiceエンティティを取得
        const practiceResult = await getPracticeById(practiceId);
        if (!practiceResult.ok) {
            return err({
                type: "NOT_FOUND",
                message: "練習データが見つかりません",
            });
        }

        const practice = practiceResult.value;
        const sheetMusicUrl = practice.sheetMusicUrl;

        if (!sheetMusicUrl) {
            return err({
                type: "NOT_FOUND",
                message: "シートミュージックのURLが設定されていません",
            });
        }

        // CloudFrontのURLからXMLデータを取得
        const response = await fetch(sheetMusicUrl);
        
        if (!response.ok) {
            if (response.status === 404) {
                return err({
                    type: "NOT_FOUND",
                    message: "楽譜が見つかりません",
                });
            }
            return err({
                type: "FILE_UPLOAD_ERROR",
                message: `楽譜の取得に失敗しました: ${response.status} ${response.statusText}`,
            });
        }

        const xmlContent = await response.text();
        return ok(xmlContent);
    } catch (error) {
        console.error(error);
        return err({
            type: "FILE_UPLOAD_ERROR",
            message: `楽譜の取得に失敗しました: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
    }
}