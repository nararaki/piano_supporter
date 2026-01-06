import { uuidv7 } from "uuidv7";
import { composer, arranger } from "../../../infrastructure/db/schema/composer.ts";
import { music } from "../../../infrastructure/db/schema/music.ts";
import { db } from "../../../infrastructure/db/initial.ts";
import { err, ok } from "@piano_supporter/common/lib/error.js";
import fs from "node:fs/promises";
import path from "node:path";

export const seedComposersAndMusics = async () => {
    try {
        const now = new Date();
        
        // Composersのシードデータ
        const composerData = [
            { id: uuidv7(), name: "Johann Sebastian Bach" },
            { id: uuidv7(), name: "Wolfgang Amadeus Mozart" },
            { id: uuidv7(), name: "Ludwig van Beethoven" },
            { id: uuidv7(), name: "Frédéric Chopin" },
            { id: uuidv7(), name: "Johannes Brahms" },
            { id: uuidv7(), name: "Pyotr Ilyich Tchaikovsky" },
            { id: uuidv7(), name: "Antonín Dvořák" },
            { id: uuidv7(), name: "Sergei Rachmaninoff" },
            { id: uuidv7(), name: "Sergei Prokofiev" },
            { id: uuidv7(), name: "Dmitri Shostakovich" },
            { id: uuidv7(), name: "Igor Stravinsky" },
            { id: uuidv7(), name: "Claude Debussy" },
        ];

        // Arrangersのシードデータ（composerと同じ人をarrangerとしても登録）
        const arrangerData = [
            { id: uuidv7(), name: "Default Arranger" },
        ];

        // Composersを挿入
        for (const composerItem of composerData) {
            await db.insert(composer).values({
                ...composerItem,
                createdAt: now,
                updatedAt: now,
            });
        }

        // Arrangersを挿入
        for (const arrangerItem of arrangerData) {
            await db.insert(arranger).values({
                ...arrangerItem,
                createdAt: now,
                updatedAt: now,
            });
        }
        
        // Musicsのシードデータ（composerIdとarrangerIdを使用）
        const musicData = [
            {
                id: uuidv7(),
                title: "ピアノソナタ第14番 ハ短調 k545-1",
                composerId: composerData[3].id, // Chopin
                arrangerId: arrangerData[0].id,
                sheetMusicUrl: "https://www.sheetmusic.com",
            },
            {
                id: uuidv7(),
                title: "ハ短調の前奏曲",
                composerId: composerData[2].id, // Beethoven
                arrangerId: arrangerData[0].id,
                sheetMusicUrl: "https://www.sheetmusic.com",
            },
            {
                id: uuidv7(),
                title: "トッカータとフーガ ニ短調",
                composerId: composerData[0].id, // Bach
                arrangerId: arrangerData[0].id,
                sheetMusicUrl: "https://www.sheetmusic.com",
            },
        ];

        // Musicsを挿入
        for (const musicItem of musicData) {
            await db.insert(music).values({
                ...musicItem,
                createdAt: now,
            });
        }

        // JSONファイルにmusicデータを保存（xmlFileNameは空文字列で初期化）
        const mappingFilePath = path.join(process.cwd(), "src", "util", "seed", "sheet", "music-xml-mapping.json");
        const mappingDir = path.dirname(mappingFilePath);
        
        // ディレクトリが存在しない場合は作成
        try {
            await fs.mkdir(mappingDir, { recursive: true });
        } catch {
            // ディレクトリが既に存在する場合は無視
        }

        // 既存のマッピングファイルを読み込む（存在する場合）
        let existingMappings: Array<{ id: string; title: string; xmlFileName: string }> = [];
        try {
            const existingContent = await fs.readFile(mappingFilePath, "utf-8");
            existingMappings = JSON.parse(existingContent);
        } catch {
            // ファイルが存在しない場合は空配列のまま
        }

        // 新しいmusicデータをマッピングに追加（既に存在するIDは更新しない）
        const newMappings = musicData.map((item) => {
            const existing = existingMappings.find((m) => m.id === item.id);
            return {
                id: item.id,
                title: item.title,
                xmlFileName: existing?.xmlFileName || "",
            };
        });

        // 既存のマッピングと新しいマッピングをマージ（新しいもの優先）
        const allMappings = [
            ...existingMappings.filter((m) => !musicData.some((item) => item.id === m.id)),
            ...newMappings,
        ];

        // JSONファイルに保存
        await fs.writeFile(
            mappingFilePath,
            JSON.stringify(allMappings, null, 2),
            "utf-8",
        );

        console.log(`[seedComposersAndMusics] music-xml-mapping.jsonに${newMappings.length}件のデータを保存しました`);

        return ok({
            message: "composerとmusicデータの挿入が完了しました",
        });
    } catch (error) {
        return err({
            type: "UNEXPECTED",
            message: "composerとmusicデータの挿入に失敗しました: " + error,
        });
    }
}