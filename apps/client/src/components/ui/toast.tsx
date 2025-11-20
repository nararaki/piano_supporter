import { toast } from "@/app/hooks/use-toast";

/**
 * エラーメッセージを表示するヘルパー関数
 */
export function showError(message: string, description?: string) {
	toast({
		variant: "destructive",
		title: message,
		description: description,
	});
}

/**
 * 成功メッセージを表示するヘルパー関数
 */
export function showSuccess(message: string, description?: string) {
	toast({
		title: message,
		description: description,
	});
}

/**
 * 情報メッセージを表示するヘルパー関数
 */
export function showInfo(message: string, description?: string) {
	toast({
		title: message,
		description: description,
	});
}
