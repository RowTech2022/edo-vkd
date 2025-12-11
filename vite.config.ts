import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@pdftron/webviewer/public/*",
          dest: "lib/webviewer",
        },
      ],
    }),
  ],
  server: {
    port: 3000,
    fs: {
      cachedChecks: false,
    },
  },
  preview: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@root": path.resolve(__dirname, "src/"),
      "@modules": path.resolve(__dirname, "src/pages/modules/index"),
      "@ui": path.resolve(__dirname, "src/shared/ui/index"),
      "@hooks": path.resolve(__dirname, "src/shared/hooks/index"),
      "@shared": path.resolve(__dirname, "src/shared/index"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@components": path.resolve(__dirname, "src/components/index"),
      "@configs": path.resolve(__dirname, "src/shared/configs/index"),
      "@utils": path.resolve(__dirname, "src/shared/utils/index"),
      "@layouts": path.resolve(__dirname, "src/layouts/index"),
      "@services": path.resolve(__dirname, "src/services/"),
      "@icons": path.resolve(__dirname, "src/shared/ui/Icons/index"),
    },
  },
});
