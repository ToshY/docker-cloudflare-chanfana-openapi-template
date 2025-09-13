import { contentJson, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { AppContext } from "../types";

export class EchoEndpoint extends OpenAPIRoute {
	public schema = {
		tags: ["Utility"],
		summary: "Echo back the request data",
		operationId: "echo",
		request: {
			body: contentJson(
				z.object({
					message: z.string(),
					data: z.any().optional(),
				}),
			),
		},
		responses: {
			"200": {
				description: "Returns the echoed data",
				...contentJson({
					success: z.boolean(),
					result: z.object({
						echo: z.object({
							message: z.string(),
							data: z.any().optional(),
						}),
						timestamp: z.string(),
					}),
				}),
			},
		},
	};

	public async handle(c: AppContext) {
		const data = await this.getValidatedData<typeof this.schema>();

		return {
			success: true,
			result: {
				echo: data.body,
				timestamp: new Date().toISOString(),
			},
		};
	}
}
