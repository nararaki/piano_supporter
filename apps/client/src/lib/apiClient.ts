import type {appType} from "../../../packages/domain/src/honoResponse";
import { hc } from "hono/client";
export const client = hc<appType>('http://localhost:8000');