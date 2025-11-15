// vite.config.ts
import { defineConfig } from "file:///home/janithnirmal/Documents/GitHub/algowrite/arkenstone-ui/node_modules/vite/dist/node/index.js";
import react from "file:///home/janithnirmal/Documents/GitHub/algowrite/arkenstone-ui/node_modules/@vitejs/plugin-react/dist/index.js";
import dts from "file:///home/janithnirmal/Documents/GitHub/algowrite/arkenstone-ui/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "path";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "file:///home/janithnirmal/Documents/GitHub/algowrite/arkenstone-ui/node_modules/@storybook/addon-vitest/dist/vitest-plugin/index.js";
import { playwright } from "file:///home/janithnirmal/Documents/GitHub/algowrite/arkenstone-ui/node_modules/@vitest/browser-playwright/dist/index.js";
import tailwindcss from "file:///home/janithnirmal/Documents/GitHub/algowrite/arkenstone-ui/node_modules/@tailwindcss/vite/dist/index.mjs";
var __vite_injected_original_dirname = "/home/janithnirmal/Documents/GitHub/algowrite/arkenstone-ui";
var __vite_injected_original_import_meta_url = "file:///home/janithnirmal/Documents/GitHub/algowrite/arkenstone-ui/vite.config.ts";
var dirname = typeof __vite_injected_original_dirname !== "undefined" ? __vite_injected_original_dirname : path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  plugins: [react(), tailwindcss(), dts({
    entryRoot: "src/lib",
    outDir: "dist/types",
    insertTypesEntry: true,
    copyDtsFiles: true
  })],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/lib/index.ts"),
      name: "arkenstone-ui",
      fileName: (format) => `arkenstone-ui.${format}.js`,
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: ["react", "react-dom", "tailwindcss"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(dirname, ".storybook")
        })
      ],
      test: {
        name: "storybook",
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: "chromium"
          }]
        },
        setupFiles: [".storybook/vitest.setup.ts"]
      }
    }]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9qYW5pdGhuaXJtYWwvRG9jdW1lbnRzL0dpdEh1Yi9hbGdvd3JpdGUvYXJrZW5zdG9uZS11aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvamFuaXRobmlybWFsL0RvY3VtZW50cy9HaXRIdWIvYWxnb3dyaXRlL2Fya2Vuc3RvbmUtdWkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvamFuaXRobmlybWFsL0RvY3VtZW50cy9HaXRIdWIvYWxnb3dyaXRlL2Fya2Vuc3RvbmUtdWkvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdC9jb25maWdcIiAvPlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcbmltcG9ydCB7IHN0b3J5Ym9va1Rlc3QgfSBmcm9tICdAc3Rvcnlib29rL2FkZG9uLXZpdGVzdC92aXRlc3QtcGx1Z2luJztcbmltcG9ydCB7IHBsYXl3cmlnaHQgfSBmcm9tICdAdml0ZXN0L2Jyb3dzZXItcGxheXdyaWdodCc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xuXG5jb25zdCBkaXJuYW1lID0gdHlwZW9mIF9fZGlybmFtZSAhPT0gJ3VuZGVmaW5lZCcgPyBfX2Rpcm5hbWUgOiBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTtcblxuLy8gTW9yZSBpbmZvIGF0OiBodHRwczovL3N0b3J5Ym9vay5qcy5vcmcvZG9jcy9uZXh0L3dyaXRpbmctdGVzdHMvaW50ZWdyYXRpb25zL3ZpdGVzdC1hZGRvblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIHRhaWx3aW5kY3NzKCksIGR0cyh7XG4gICAgZW50cnlSb290OiBcInNyYy9saWJcIixcbiAgICBvdXREaXI6IFwiZGlzdC90eXBlc1wiLFxuICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXG4gICAgY29weUR0c0ZpbGVzOiB0cnVlXG4gIH0pXSxcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvbGliL2luZGV4LnRzXCIpLFxuICAgICAgbmFtZTogXCJhcmtlbnN0b25lLXVpXCIsXG4gICAgICBmaWxlTmFtZTogZm9ybWF0ID0+IGBhcmtlbnN0b25lLXVpLiR7Zm9ybWF0fS5qc2AsXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiLCBcInVtZFwiXVxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCIsIFwidGFpbHdpbmRjc3NcIl0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgIHJlYWN0OiBcIlJlYWN0XCIsXG4gICAgICAgICAgXCJyZWFjdC1kb21cIjogXCJSZWFjdERPTVwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHRlc3Q6IHtcbiAgICBwcm9qZWN0czogW3tcbiAgICAgIGV4dGVuZHM6IHRydWUsXG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAvLyBUaGUgcGx1Z2luIHdpbGwgcnVuIHRlc3RzIGZvciB0aGUgc3RvcmllcyBkZWZpbmVkIGluIHlvdXIgU3Rvcnlib29rIGNvbmZpZ1xuICAgICAgLy8gU2VlIG9wdGlvbnMgYXQ6IGh0dHBzOi8vc3Rvcnlib29rLmpzLm9yZy9kb2NzL25leHQvd3JpdGluZy10ZXN0cy9pbnRlZ3JhdGlvbnMvdml0ZXN0LWFkZG9uI3N0b3J5Ym9va3Rlc3RcbiAgICAgIHN0b3J5Ym9va1Rlc3Qoe1xuICAgICAgICBjb25maWdEaXI6IHBhdGguam9pbihkaXJuYW1lLCAnLnN0b3J5Ym9vaycpXG4gICAgICB9KV0sXG4gICAgICB0ZXN0OiB7XG4gICAgICAgIG5hbWU6ICdzdG9yeWJvb2snLFxuICAgICAgICBicm93c2VyOiB7XG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICBoZWFkbGVzczogdHJ1ZSxcbiAgICAgICAgICBwcm92aWRlcjogcGxheXdyaWdodCh7fSksXG4gICAgICAgICAgaW5zdGFuY2VzOiBbe1xuICAgICAgICAgICAgYnJvd3NlcjogJ2Nocm9taXVtJ1xuICAgICAgICAgIH1dXG4gICAgICAgIH0sXG4gICAgICAgIHNldHVwRmlsZXM6IFsnLnN0b3J5Ym9vay92aXRlc3Quc2V0dXAudHMnXVxuICAgICAgfVxuICAgIH1dXG4gIH1cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFVBQVU7QUFDakIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxpQkFBaUI7QUFUeEIsSUFBTSxtQ0FBbUM7QUFBcUwsSUFBTSwyQ0FBMkM7QUFXL1EsSUFBTSxVQUFVLE9BQU8scUNBQWMsY0FBYyxtQ0FBWSxLQUFLLFFBQVEsY0FBYyx3Q0FBZSxDQUFDO0FBRzFHLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBWSxHQUFHLElBQUk7QUFBQSxJQUNwQyxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixrQkFBa0I7QUFBQSxJQUNsQixjQUFjO0FBQUEsRUFDaEIsQ0FBQyxDQUFDO0FBQUEsRUFDRixPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsa0JBQWtCO0FBQUEsTUFDNUMsTUFBTTtBQUFBLE1BQ04sVUFBVSxZQUFVLGlCQUFpQixNQUFNO0FBQUEsTUFDM0MsU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBLElBQ3ZCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsU0FBUyxhQUFhLGFBQWE7QUFBQSxNQUM5QyxRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsVUFDUCxhQUFhO0FBQUEsUUFDZjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osVUFBVSxDQUFDO0FBQUEsTUFDVCxTQUFTO0FBQUEsTUFDVCxTQUFTO0FBQUE7QUFBQTtBQUFBLFFBR1QsY0FBYztBQUFBLFVBQ1osV0FBVyxLQUFLLEtBQUssU0FBUyxZQUFZO0FBQUEsUUFDNUMsQ0FBQztBQUFBLE1BQUM7QUFBQSxNQUNGLE1BQU07QUFBQSxRQUNKLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLFNBQVM7QUFBQSxVQUNULFVBQVU7QUFBQSxVQUNWLFVBQVUsV0FBVyxDQUFDLENBQUM7QUFBQSxVQUN2QixXQUFXLENBQUM7QUFBQSxZQUNWLFNBQVM7QUFBQSxVQUNYLENBQUM7QUFBQSxRQUNIO0FBQUEsUUFDQSxZQUFZLENBQUMsNEJBQTRCO0FBQUEsTUFDM0M7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
