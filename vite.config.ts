import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/getRestDeInfo": {
                target: "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/getRestDeInfo/, ""),
            },
        },
    },
});
