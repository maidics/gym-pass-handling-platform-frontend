import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "src/api"),
      "@components": path.resolve(__dirname, "src/components"),
      "@constants": path.resolve(__dirname, "src/constants"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@navigation": path.resolve(__dirname, "src/navigation"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@locales": path.resolve(__dirname, "src/locales"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@ui": path.resolve(__dirname, "src/components/ui"),
    },
  },
});
