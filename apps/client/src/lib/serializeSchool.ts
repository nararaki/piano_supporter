/**
 * サーバーから返されるSchool型（日付がISO文字列）を
 * クライアント側のSchool型（日付がDateオブジェクト）に変換
 */

import { err, Result } from "@piano_supporter/common/lib/error.js";
import { ok } from "@piano_supporter/common/lib/error.js";

export type Deserializable<T> = T & {
    createdAt: string; // 必須の作成日時（文字列）
    updatedAt: string; // 更新日時（文字列またはnull）
};

export const deserialize = <T>(args: Deserializable<T>): Result<T> => {
    if(!args.createdAt){
        return err({
            type: "UNEXPECTED",
            message: "createdAtが必要です",
        })
    }
    if(!args.updatedAt){
        return err({
            type: "UNEXPECTED",
            message: "updatedAtが必要です",
        })
    }
	return ok({
		...args,
		createdAt: new Date(args.createdAt),
		updatedAt: args.updatedAt ? new Date(args.updatedAt) : null,
	});
};

