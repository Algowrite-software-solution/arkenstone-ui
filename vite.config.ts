import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: "src/lib",
      outDir: "dist/types",
      insertTypesEntry: true,
      copyDtsFiles: true
    }),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "src/lib/css/theme.css",
          dest: "./css/"
        }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src/lib")
    }
  },
  build: {
    // Standard build targets
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "arkenstone-ui",
      fileName: "index",
      formats: ["es"] // ESM is best for tree-shaking
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
});