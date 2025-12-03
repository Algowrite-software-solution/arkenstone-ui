import { ColumnDef } from "@tanstack/react-table";
import { ServiceFactory } from "../../services/service-factory"; // Point to your Factory

// --- Input Types ---
export type InputType = 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'date' | 'image' | 'custom';

export interface ValidationRule {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any, allValues: any) => string | null; // Return error message or null
    message?: string;
}

export interface InputOption {
    label: string;
    value: string | number;
}

export interface FieldConfig {
    name: string; // Key in the data object
    label: string;
    type: InputType;
    placeholder?: string;
    defaultValue?: any;
    
    // For Selects/Radios
    options?: InputOption[];
    fetchOptions?: () => Promise<InputOption[]>; // Dynamic data source
    
    // For Images
    uploadEndpoint?: string; // If present, uploads immediately. If not, keeps File object.
    
    // Logic
    validation?: ValidationRule;
    hidden?: boolean | ((values: any) => boolean); // Conditional visibility
    disabled?: boolean;
    className?: string;
    
    // Custom Component
    renderCustom?: (props: { value: any; onChange: (v: any) => void; error?: string }) => React.ReactNode;
}

// --- Layout Types ---
export type LayoutType = 'split-view' | 'modal' | 'tab-view' | 'fullscreen';

// --- Main Configuration ---
export interface DataManagerConfig<T extends object> {
    title: string;
    description?: string;
    
    // Service Instance
    service: ServiceFactory<T, any, any, any>;
    
    // Layout
    layout: LayoutType;
    
    // Data Display Configuration
    display: {
        type: 'table' | 'list' | 'grid';
        columns: ColumnDef<T>[]; // For Table
        searchKeys?: string[]; // Fields to enable search on
        renderItem?: (item: T) => React.ReactNode; // For List/Grid view
    };
    
    // Input/Form Configuration
    form: {
        fields: FieldConfig[];
        submitLabel?: string;
        // If true, form updates live (for settings pages), else waits for save button
        liveUpdate?: boolean; 
    };

    // Developer Settings
    devMode?: boolean; // Enable console logs
}