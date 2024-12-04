import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Intercept absolute URLs
      '/api': {
        target: 'https://event-ify.xyz',
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.startsWith('/https://event-ify.xyz/api')
            ? path.replace('/https://event-ify.xyz', '')
            : path,
      },
    },
  },
});
