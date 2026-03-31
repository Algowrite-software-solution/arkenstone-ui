import { Product, ProductImage } from "@/e-commerce/product";

// Export existing types
export interface Stock {
    id: number;
    product_id: number;
    sku: string;
    barcode: string | null;
    price: number;
    cost: number | null;
    weight: number | null;
    quantity_on_hand: number;
    quantity_reserved: number;
    quantity_available: number;
    min_stock_level: number | null;
    supplier_id: number | null;
    image_url_id: number | null;
    status: 'active' | 'inactive';
    is_available: boolean;
    is_low_stock: boolean;
    product?: Product;
    supplier?: Supplier;
    variation_options?: VariationOption[];
    image?: ProductImage;
    reservations?: StockReservation[];
    created_at: string;
    updated_at: string;
}

export interface StockReservation {
    id: number;
    stock_id: number;
    quantity: number;
    status: 'pending' | 'checking_out' | 'committed' | 'fulfilled' | 'cancelled' | 'expired';
    reference_type: string;
    reference_id: number;
    expires_at: string | null;
    notes: string | null;
    is_expired: boolean;
    is_pending: boolean;
    is_committed: boolean;
    stock?: Stock;
    created_at: string;
    updated_at: string;
}

export interface Supplier {
    id: number;
    name: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postal_code: string | null;
    supplier_code: string;
    status: 'active' | 'inactive';
    notes: string | null;
    is_active: boolean;
    stocks_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Variant {
    id: number;
    name: string;
    variation_options?: VariationOption[];
    options_count?: number;
    created_at: string;
    updated_at: string;
}

export interface VariationOption {
    id: number;
    variant_id: number;
    name: string;
    meta: Record<string, any> | null;
    variant?: Variant;
    stocks_count?: number;
    created_at: string;
    updated_at: string;
}


// Additional utility types
export type StockStatus = 'active' | 'inactive' | 'out_of_stock' | 'discontinued';
export type ReservationStatus = 'pending' | 'checking_out' | 'committed' | 'fulfilled' | 'cancelled' | 'expired';
export type SupplierStatus = 'active' | 'inactive';