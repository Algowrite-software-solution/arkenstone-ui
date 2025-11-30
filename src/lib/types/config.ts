/**
 * Global configuration for the framework
 */
export interface AppConfig {
    theme: "light" | "dark";
    currency: "USD" | "LKR" | "EUR";
    features: {
        reviewsEnabled: boolean;
        wishlistEnabled: boolean;
        productZoom: boolean;
    };
    api?: {
        url?: string;
        isSameOrigin?: boolean;
        withCredentials?: boolean;
    };
}
