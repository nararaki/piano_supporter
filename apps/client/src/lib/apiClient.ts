import type { appType } from "@piano_supporter/common/commonResponseType/honoResponse";
import { hc } from "hono/client";
export const client = hc<appType>("http://localhost:8000");
