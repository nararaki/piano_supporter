import { err } from "@piano_supporter/common/lib/error.ts";

export const fileToBuffer = async (file: File): Promise<Buffer> => {
	return new Promise<Buffer>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.result instanceof ArrayBuffer) {
				resolve(Buffer.from(reader.result));
			} else {
				reject(
					err({
						type: "FILE_CONVERSION_ERROR",
						message: "Failed to convert file to buffer",
					}),
				);
			}
		};
		reader.onerror = () => {
			reject(
				err({
					type: "FILE_CONVERSION_ERROR",
					message: "Failed to convert file to buffer",
				}),
			);
		};
	});
};
