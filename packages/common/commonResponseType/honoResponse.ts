import type { AppType } from "../../../apps/server/src/interface/index";
import type {
	accountCreateData,
	schoolCreateData,
} from "../../../apps/server/src/interface/schema";

export type appType = AppType;
//interface層からの型共有,clientのリクエストの型
export type AccountCreateData = accountCreateData;
export type SchoolCreateData = schoolCreateData;
