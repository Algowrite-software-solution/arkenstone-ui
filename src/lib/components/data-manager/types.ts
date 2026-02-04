import { ColumnDef } from "@tanstack/react-table";
import { ServiceFactory } from "../../services/service-factory"; // Point to your Factory

// --- Input Types ---
export type InputType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "textarea"
  | "select"
  | "checkbox"
  | "date"
  | "image"
  | "custom";

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

  // loading current data for update state from custom response pattern
  currentDataLoadConfig?: {
    useObjectKey?: string;
    /** it must return the actual value for the field */
    transform?: (data: any) => any;
    useObjectIdProperty?: boolean;
  };

  label: string;
  type: InputType;
  placeholder?: string;
  defaultValue?: any;
  onChange?: (value: any) => void;

  // For Selects/Radios
  options?: InputOption[];
  fetchOptions?: () => Promise<InputOption[]>; // Dynamic data source
  defaultOption?: InputOption | (() => InputOption);
  enableDefaultOption?: boolean;

  // For Images
  uploadEndpoint?: string; // If present, uploads immediately. If not, keeps File object.
  maxCount?: number; // Max number of images allowed
  maxSize?: number; // Max size in MB
  accept?: string; // File types to accept

  removeImageOptions?: {
    removedImagesField?: string; // Key to use for sending removed image URLs/IDs
    removedImagesKey?: string; // Key to use for sending removed image URLs/IDs
    removeEndpoint?: string;
  };

  previewOptions?: {
    key?: string;
    transform?: (file: any) => any;
  };

  // Logic
  validation?: ValidationRule;
  hidden?: boolean | ((values: any) => boolean); // Conditional visibility
  disabled?: boolean;
  className?: string;

  // Custom Component
  renderCustom?: (props: {
    value: any;
    onChange: (v: any) => void;
    error?: string;
  }) => React.ReactNode;
}

// --- Layout Types ---
export type LayoutType = "split-view" | "modal" | "tab-view" | "fullscreen";

// --- Main Configuration ---
export interface DataManagerConfig<T extends object> {
  title: string;
  description?: string;

  // Service Instance
  service: ServiceFactory<T, any, any, any>;

  // Layout
  layout: LayoutType;
  // for modals - default is 'md'
  modalSize?: "sm" | "md" | "lg" | "xl" | "full";

  // Data Display Configuration
  display: {
    type: "table" | "list" | "grid";

    // For Table
    columns: ColumnDef<T>[];
    searchKeys?: string[]; // Fields to enable search on

    // For List/Grid view
    renderItem?: (item: T) => React.ReactNode;
  };

  // Input/Form Configuration
  form: {
    fields: FieldConfig[];
    submitLabel?: string;
    // If true, form updates live (for settings pages), else waits for save button
    liveUpdate?: boolean;

    /**
     * If true, skips dirty checking and sends all form values on update.
     * Useful for legacy APIs that expect the full object.
     * @default false
     */
    disablePartialUpdate?: boolean;
  };

  // data udpate config
  updateFormValues?: {
    data: any;
    loadData: boolean;
  };

  // Developer Settings
  devMode?: boolean; // Enable console logs
}
