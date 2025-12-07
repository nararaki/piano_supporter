import { uuidv7 } from "uuidv7";
import { composer } from "../schema/composer.ts";
import { db } from "../initial.ts";
import { err, ok } from "@piano_supporter/common/lib/error.js";

export const seedComposers = async () => {
    try{
    const now = new Date();
    const composerData = [
        {
            id: uuidv7(),
            name: "Johann Sebastian Bach",
        },
        {
            id: uuidv7(),
            name: "Wolfgang Amadeus Mozart",
        },
        {
            id: uuidv7(),
            name: "Ludwig van Beethoven",
        },
        {
            id: uuidv7(),
            name: "Frédéric Chopin",
        },
        {
            id: uuidv7(),
            name: "Johannes Brahms",
        },
        {
            id: uuidv7(),
            name: "Pyotr Ilyich Tchaikovsky",
        },
        {
            id: uuidv7(),
            name: "Antonín Dvořák",
        },
        {
            id: uuidv7(),
            name: "Sergei Rachmaninoff",
        },
        {
            id:uuidv7(),
            name: "Sergei Prokofiev"
        },
        {
            id:uuidv7(),
            name: "Dmitri Shostakovich"
        },
        {
            id:uuidv7(),
            name: "Igor Stravinsky"
        },
        {
            id:uuidv7(),
            name: "Claude Debussy"
        },
    ];
    for (const composerItem of composerData) {
        await db.insert(composer).values({
            ...composerItem,
            createdAt: now,
            updatedAt: now,
        });
    }
        return ok({
            message: "composerデータの挿入が完了しました",
        });
    } catch (error) {
        return err({
            type: "UNEXPECTED",
            message: "composerデータの挿入に失敗しました: " + error,
        });
    }
}