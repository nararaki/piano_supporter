export interface School {
	id: string;
	name: string;
	email: string;
	location: string;
	shareCode: string;
	createdAt: Date;
	updatedAt: Date | null;
}

export type createServerSchool = Omit<School, "createdAt" | "updatedAt">;
export type createSchoolDatabase = Omit<
	School,
	"createdAt" | "updatedAt"
>;
export type SchoolCreateData = Omit<
	School,
	"id" | "createdAt" | "updatedAt" | "shareCode"
>;

/**
 * スクールエンティティを作成
 * @param data スクール作成データ
 * @param shareCode 共有コード（指定しない場合は自動生成）
 */
export const createSchoolEntity = (
	data: SchoolCreateData,
	shareCode?: string,
) => {
	return {
		name: data.name,
		location: data.location,
		email: data.email,
		shareCode: shareCode || "", // 呼び出し側でuuidv7を生成する
	};
};

