import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const apiKeyMiddleware = async (c: Context, next: Next) => {
	const apiKey = c.req.header("x-api-key");
	if (!apiKey || apiKey !== c.env?.API_KEY) {
		throw new HTTPException(401, { message: "Invalid API Key." });
	}
	await next();
};
