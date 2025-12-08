export type Result<T> = { ok: true; value: T } | { ok: false; error: AppError };

export type AppError =
	| { type: "AccountValidaterError"; message: "ユーザー認証をしてください" }
	| { type: "FILE_UPLOAD_ERROR"; message: string }
	| { type: "FILE_CONVERSION_ERROR"; message: string }
	| { type: "UNEXPECTED"; message: string }
	| { type: "BAD_REQUEST"; message: string } // 400
	| { type: "NOT_FOUND"; message: string } // 404
	| { type: "SERVER_ERROR"; message: string } // 500
	| { type: "CANNOT_CREATE_ACCOUNT"; message: string }
	| { type: "CANNOT_CREATE_SCHOOL"; message: string }
	| { type: "CANNOT_FIND_SCHOOL"; message: string }
	| { type: "CANNOT_ENROLL_ACCOUNT_TO_SCHOOL"; message: string }
	| { type: "CANNOT_FIND_ACCOUNT"; message: string }
	| { type: "CANNOT_FIND_VIDEO"; message: string }

export function ok<T>(value: T): Result<T> {
	return { ok: true, value };
}

export function err<T>(error: AppError): Result<T> {
	return { ok: false, error };
}
