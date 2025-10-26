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

	describe("GET /movies", () => {
		it("should return movies", async () => {
			const response = await authenticatedFetch(`http://local.test/movies?page=1&per_page=5`);
			const body = await response.json<{
				success: boolean;
				result: any[];
				result_info: { page: number; per_page: number; total_count: number };
			}>();

			expect(response.status).toBe(200);
			expect(body.success).toBe(true);

			// Ensure pagination is respected
			expect(body.result).toHaveLength(5);
			expect(body.result_info.page).toBe(1);
			expect(body.result_info.per_page).toBe(5);

			// Optional: check structure of a single movie entry
			for (const movie of body.result) {
				expect(movie).toHaveProperty("id");
				expect(movie).toHaveProperty("title");
				expect(movie).toHaveProperty("rating");
				expect(movie).toHaveProperty("genres");
				expect(Array.isArray(movie.genres)).toBe(true);
			}
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
