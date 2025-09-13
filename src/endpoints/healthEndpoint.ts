import { contentJson, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { AppContext } from "../types";

export class HealthEndpoint extends OpenAPIRoute {
	public schema = {
		tags: ["Health"],
		summary: "Health check endpoint",
		operationId: "health-check",
		responses: {
			"200": {
				description: "Returns the health status",
				...contentJson({
					success: z.boolean(),
					result: z.object({
						status: z.string(),
						timestamp: z.string(),
						version: z.string(),
					}),
				}),
			},
		},
	};

	public async handle(c: AppContext) {
		return {
			success: true,
			result: {
				status: "healthy",
				timestamp: new Date().toISOString(),
				version: "2.0.0",
			},
		};
	}
}
