import { env, SELF } from "cloudflare:test";

export const authenticatedFetch = (url: string, options: RequestInit = {}) => {
	const headers = {
		"x-api-key": env.API_KEY,
		...options.headers,
	};

	return SELF.fetch(url, {
		...options,
		headers,
	});
};

// You can add more test utilities here
export const createTestRequest = (
	body: any,
	additionalHeaders: HeadersInit = {},
) => ({
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"x-api-key": env.API_KEY,
		...additionalHeaders,
	},
	body: JSON.stringify(body),
});
