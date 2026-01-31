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

        // Composersのシードデータ（idはautoincrement）
        const composerNames = [
            "Johann Sebastian Bach",
            "Wolfgang Amadeus Mozart",
            "Ludwig van Beethoven",
            "Frédéric Chopin",
            "Johannes Brahms",
            "Pyotr Ilyich Tchaikovsky",
            "Antonín Dvořák",
            "Sergei Rachmaninoff",
            "Sergei Prokofiev",
            "Dmitri Shostakovich",
            "Igor Stravinsky",
            "Claude Debussy",
        ];

        // Arrangersのシードデータ（varchar id）
        const arrangerData = [
            { id: uuidv7(), name: "Default Arranger" },
        ];

        // Composersを挿入してIDを取得
        const insertedComposers: Array<{ id: number; name: string }> = [];
        for (const name of composerNames) {
            const result = await db.insert(composer).values({ name });
            insertedComposers.push({
                id: Number(result[0].insertId),
                name,
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

        // Musicsのシードデータ（composerIdはint、arrangerIdはvarchar）
        const musicData = [
            {
                title: "ピアノソナタ第14番 ハ短調 k545-1",
                composerId: insertedComposers[1].id, // Mozart
                arrangerId: arrangerData[0].id,
                sheetMusicUrl: "https://www.sheetmusic.com",
            },
            {
                title: "ハ短調の前奏曲",
                composerId: insertedComposers[2].id, // Beethoven
                arrangerId: arrangerData[0].id,
                sheetMusicUrl: "https://www.sheetmusic.com",
            },
            {
                title: "トッカータとフーガ ニ短調",
                composerId: insertedComposers[0].id, // Bach
                arrangerId: arrangerData[0].id,
                sheetMusicUrl: "https://www.sheetmusic.com",
            },
        ];

        // Musicsを挿入してIDを取得
        const insertedMusics: Array<{ id: number; title: string }> = [];
        for (const musicItem of musicData) {
            const result = await db.insert(music).values({
                title: musicItem.title,
                composerId: musicItem.composerId,
                arrangerId: musicItem.arrangerId,
                sheetMusicUrl: musicItem.sheetMusicUrl,
            });
            insertedMusics.push({
                id: Number(result[0].insertId),
                title: musicItem.title,
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
        let existingMappings: Array<{ id: number; title: string; xmlFileName: string }> = [];
        try {
            const existingContent = await fs.readFile(mappingFilePath, "utf-8");
            existingMappings = JSON.parse(existingContent);
        } catch {
            // ファイルが存在しない場合は空配列のまま
        }

        // 新しいmusicデータをマッピングに追加（既に存在するIDは更新しない）
        const newMappings = insertedMusics.map((item) => {
            const existing = existingMappings.find((m) => m.id === item.id);
            return {
                id: item.id,
                title: item.title,
                xmlFileName: existing?.xmlFileName || "",
            };
        });

        // 既存のマッピングと新しいマッピングをマージ（新しいもの優先）
        const allMappings = [
            ...existingMappings.filter((m) => !insertedMusics.some((item) => item.id === m.id)),
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