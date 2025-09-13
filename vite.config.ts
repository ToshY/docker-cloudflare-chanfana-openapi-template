import { cloudflare } from "@cloudflare/vite-plugin";
import devServer from "@hono/vite-dev-server";
import cloudflareAdapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			cloudflare(),
			devServer({
				adapter: cloudflareAdapter,
			}),
		],
		server: {
			host: "0.0.0.0",
			port: 8787,
			hmr: {
				host: "localhost",
				clientPort: 8788,
				protocol: "ws",
			},
		},
	};
});
