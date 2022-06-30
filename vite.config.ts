import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    server: {
        proxy: {
            "/api/getRestDeInfo": {
                target: "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo",
                changeOrigin: true,
                secure: false,
                rewrite: (path: string) => path.replace(/^\/api\/getRestDeInfo/, ""),
            },
        },
    },
    preview: {
        proxy: {
            "/api/getRestDeInfo": {
                target: "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo",
                changeOrigin: true,
                secure: false,
                rewrite: (path: string) => path.replace(/^\/api\/getRestDeInfo/, ""),
            },
        },
    },
});
