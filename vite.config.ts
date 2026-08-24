import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fs from 'fs';
import path from 'path';

function scopeCssPlugin() {
  return {
    name: 'scope-css-plugin',
    closeBundle() {
      const cssPath = path.resolve(__dirname, 'dist/index.css');
      if (fs.existsSync(cssPath)) {
        let css = fs.readFileSync(cssPath, 'utf8');
        
        // Locate and strip the compiled @layer theme block completely
        const startIndex = css.indexOf('@layer theme{');
        if (startIndex !== -1) {
          let braceCount = 0;
          let endIndex = -1;
          for (let i = startIndex + 12; i < css.length; i++) {
            if (css[i] === '{') braceCount++;
            else if (css[i] === '}') {
              if (braceCount === 0) {
                endIndex = i;
                break;
              }
              braceCount--;
            }
          }
          if (endIndex !== -1) {
            css = css.slice(0, startIndex) + css.slice(endIndex + 1);
          }
        }
        
        // Strip the .ark-ui-root static variable blocks completely
        css = css.replace(/\.ark-ui-root\{[^}]*\}/g, '');
        css = css.replace(/\.ark-ui-root\.dark,\.dark \.ark-ui-root\{[^}]*\}/g, '');
        
        fs.writeFileSync(cssPath, css, 'utf8');
        console.log('Successfully stripped all compiled theme variables and scoped blocks from dist/index.css');
      }
    }
  };
}

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
          src: "src/lib/css/*.css",
          dest: "./css/"
        }
      ]
    }),
    scopeCssPlugin()
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
      external: ["react", "react-dom", "react/jsx-runtime", "sonner"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src/lib",
        entryFileNames: "[name].js",
        assetFileNames: "index.css",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          sonner: "Sonner"
        }
      }
    }
  }
});