import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { DummyEndpoint } from "./endpoints/dummyEndpoint";
import { EchoEndpoint } from "./endpoints/echoEndpoint";
import { HealthEndpoint } from "./endpoints/healthEndpoint";
import { PaginationEndpoint } from "./endpoints/paginationEndpoint";
import { apiKeyMiddleware } from "./middleware/apiKeyMiddleware";

extendZodWithOpenApi(z);

const app = new Hono<{ Bindings: Env }>();

app.onError((err, c) => {
	// Chanfana ApiException
	if (err instanceof ApiException) {
		return c.json(
			{ success: false, errors: err.buildResponse() },
			err.status as ContentfulStatusCode,
		);
	}

	// Generic HTTPException
	if (err instanceof HTTPException) {
		return c.json(
			{ success: false, message: err.message },
			err.status as ContentfulStatusCode,
		);
	}

	console.error(err);

	c.status(500 as 500);
	return c.json({
		success: false,
		errors: [{ code: 7000, message: "Internal Server Error" }],
	});
});

// Setup OpenAPI
const openapi = fromHono(app, {
	docs_url: "/",
	schema: {
		info: {
			title: "My Awesome API",
			version: "2.0.0",
			description: "This is the documentation for my awesome API.",
		},
		security: [
			{
				apiKeyAuth: [],
			},
		],
	},
});

// Register the security scheme component using Chanfana's proper method
openapi.registry.registerComponent("securitySchemes", "apiKeyAuth", {
	type: "apiKey",
	in: "header",
	name: "x-api-key",
	description: "API key for authentication",
});

app.use("*", async (c, next) => {
	const isDev = c.env?.APP_ENV === "development";

	// Dev allow OpenAPI, Vite watch/HMR paths, OPTIONS
	if (isDev) {
		const p = c.req.path;
		if (p === "/" || p === "/openapi.json") return next();
		if (p.startsWith("/@vite") || p.startsWith("/vite-hmr")) return next();
		if (c.req.method === "OPTIONS") return next();
	}

	// Enforce API key for non-dev environment
	return apiKeyMiddleware(c, next);
});

// Endpoints
openapi.post("/dummy/:slug", DummyEndpoint);
openapi.get("/health", HealthEndpoint);
openapi.post("/echo", EchoEndpoint);
openapi.get("/movies", PaginationEndpoint);

export default app;
