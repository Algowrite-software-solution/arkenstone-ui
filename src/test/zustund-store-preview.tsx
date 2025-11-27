import { useConfigStore } from "../lib/stores/config.store"; // Adjust path
import { Button } from "../lib/components/ui/button";

export function ZustendStorePreview() {
  return (
    <div className="flex flex-col gap-3 bg-blue-100 rounded-2xl">
      <ConfigStorePreview />
    </div>
  );
}

export function ConfigStorePreview() {
  const { theme, currency, features, toggleTheme, toggleFeature, update } =
    useConfigStore();

  return (
    <div className="p-5 border rounded-lg space-y-4">
      <h2 className="font-bold text-2xl text-blue-500">App Configurations</h2>
      <p className="text-sm">
        This store is percistance and nested values are mutable indipendently
      </p>

      {/* Display Current State */}
      <div className="bg-blue-300 p-2 rounded-lg">
        <p>
          <strong>Theme:</strong> {theme}
        </p>
        <p>
          <strong>Currency:</strong> {currency}
        </p>
        <p>
          <strong>Reviews:</strong>{" "}
          {features.reviewsEnabled ? "Enabled" : "Disabled"}
        </p>
      </div>

      <div className="flex gap-4">
        {/* 1. TOGGLE THEME (Using Custom Action) */}
        {/* Note: Your interface asks for an arg, but implementation ignores it. 
            We pass 'dark' to satisfy TypeScript, but your logic just toggles. */}
        <Button onClick={() => toggleTheme("dark")} className="btn-primary">
          Switch to Dark
        </Button>

        <Button onClick={() => toggleTheme()} className="btn-primary">
          Toggle Theme
        </Button>

        {/* 2. TOGGLE FEATURE (Using Custom Action) */}
        <Button
          onClick={() => toggleFeature("reviewsEnabled")}
          className="btn-secondary"
        >
          Toggle Reviews
        </Button>

        {/* 3. CHANGE CURRENCY (Using Generic Update) */}
        {/* This is the magic. You didn't write a 'setCurrency' action, 
            but 'update' lets you mutate state directly safely. */}
        <Button
          onClick={() => {
            update((state) => {
              state.currency = "EUR";
            });
          }}
          className="btn-accent"
        >
          Set Currency to EUR
        </Button>

        <Button
          onClick={() => {
            update((state) => {
              state.currency = "LKR";
            });
          }}
          className="btn-accent"
        >
          Set Currency to GBP
        </Button>
      </div>
    </div>
  );
}
