//🦄🌈this is a pinanosupporter's hooks!!🌈🦄

import dotenv from "dotenv";
dotenv.config();

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { accountRoute, enrollSchoolRoute, schoolRoute, postsRoute, practiceRoute, composersRoute, musicsRoute } from "./router.ts";

export const apiRoutes = new Hono()
	.route("/account-init", accountRoute)
	.route("/school-init", schoolRoute)
	.route("/school", schoolRoute)
	.route("/enroll-school", enrollSchoolRoute)
	.route("/posts", postsRoute)
	.route("/practice", practiceRoute)
	.route("/composers", composersRoute)
	.route("/musics", musicsRoute);

const app = new Hono()
	.use(
		"/*",
		cors({
			origin: ["http://localhost:3000"],

			allowMethods: ["POST", "GET", "OPTIONS"],

			allowHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.get("/", (c) => {
		return c.text("Hello Hono!");
	})
	.route("/", apiRoutes);

serve(
	{
		fetch: app.fetch,
		port: 8000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);

export type AppType = typeof apiRoutes;
