import type { z } from "zod";
//インポートきれいにしたいけど分からん
import type { AccountCreateSchema, SchoolCreateSchema, EnrollSchoolCreateSchema } from "../../../apps/server/src/interface/sheme.ts";
import type { AppType } from "../../../apps/server/src/interface/index.ts";

export type accountCreateData = z.infer<typeof AccountCreateSchema>;
export type schoolCreateData = z.infer<typeof SchoolCreateSchema>;
export type shareCodeCreateData = z.infer<typeof EnrollSchoolCreateSchema>;

export type appType = AppType;