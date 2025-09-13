import { beforeEach, describe, expect, it, vi } from "vitest";
import { authenticatedFetch, createTestRequest } from "../utils/testHelpers";

describe("API Integration Tests", () => {
	beforeEach(async () => {
		vi.clearAllMocks();
	});

	describe("GET /health", () => {
		it("should return health status", async () => {
			const response = await authenticatedFetch(`http://local.test/health`);
			const body = await response.json<{ success: boolean; result: any }>();

			expect(response.status).toBe(200);
			expect(body.success).toBe(true);
			expect(body.result.status).toBe("healthy");
			expect(body.result).toHaveProperty("timestamp");
			expect(body.result).toHaveProperty("version");
		});
	});

	describe("POST /echo", () => {
		it("should echo back the request data", async () => {
			const requestBody = {
				message: "Hello World",
				data: { test: "data" },
			};

			const response = await authenticatedFetch(
				`http://local.test/echo`,
				createTestRequest(requestBody),
			);
			const body = await response.json<{ success: boolean; result: any }>();

			expect(response.status).toBe(200);
			expect(body.success).toBe(true);
			expect(body.result.echo).toEqual(requestBody);
			expect(body.result).toHaveProperty("timestamp");
		});
	});
});
