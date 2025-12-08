import { uuidv7 } from "uuidv7";
import { composer, arranger } from "../schema/composer.ts";
import { music } from "../schema/music.ts";
import { db } from "../initial.ts";
import { err, ok } from "@piano_supporter/common/lib/error.js";

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
                title: "子犬のワルツ",
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