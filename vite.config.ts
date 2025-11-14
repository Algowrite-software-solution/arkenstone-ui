import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: "src/lib",
      outDir: "dist/types",
      insertTypesEntry: true,
      copyDtsFiles: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "arkenstone-ui",
      fileName: (format) => `arkenstone-ui.${format}.js`,
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
});
