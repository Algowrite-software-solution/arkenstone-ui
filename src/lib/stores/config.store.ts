import type { AppConfig } from "../types/config";
import { createGenericStore } from "./store-factory";

const initialConfig: AppConfig = {
  theme: "light",
  currency: "USD",
  features: {
    reviewsEnabled: true,
    wishlistEnabled: true,
    productZoom: false,
  },
  api: {
    url: '/api/v1',
    isSameOrigin: false,
    withCredentials: false,
  },
};

interface ConfigActions {
  toggleTheme: (theme?: AppConfig["theme"]) => void;
  toggleFeature: (key: keyof AppConfig["features"]) => void;
  setApi: (api: AppConfig["api"]) => void;
}

export const useConfigStore = createGenericStore<AppConfig, ConfigActions>(
  initialConfig,
  {
    name: "app-config", // Persist enabled
    methods: (set) => ({
      toggleTheme: (theme?: AppConfig["theme"]) =>
        set((state) => {
          state.theme = theme ?? (state.theme === "light" ? "dark" : "light");
        }),
      toggleFeature: (key: keyof AppConfig["features"]) =>
        set((state) => {
          state.features[key] = !state.features[key];
        }),

      setApi: (api: AppConfig["api"]) =>
        set((state) => {
          state.api = api;
        }),
    }),
  }
);
