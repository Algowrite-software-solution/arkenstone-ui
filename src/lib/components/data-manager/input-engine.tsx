import React, { useEffect, useState } from "react";
import { cn, getValue } from "@/lib/utils";
import { FieldConfig, InputOption } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { DatePicker } from "../ui/date-picker";

/**
 * Custom Hook for Debouncing
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface GenericFormProps {
  fields: FieldConfig[];
  initialValues?: any;
  onSubmit: (values: any) => void;
  isLoading?: boolean;
  isCreating: boolean;
  submitLabel?: string;
  liveUpdate?: boolean;
  className?: string;
}

export const GenericForm: React.FC<GenericFormProps> = ({
  fields,
  initialValues = {},
  onSubmit,
  isLoading,
  isCreating,
  submitLabel = "Save",
  liveUpdate = false,
  className,
}) => {
  // Local State
  const [values, setValues] = useState<any>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, InputOption[]>
  >({});

  // Watch for initial value changes (e.g. when an item is selected from list)
  useEffect(() => {
    setValues(initialValues || {});
    setErrors({});
  }, [initialValues]);

  // Fetch Dynamic Options for Selects
  useEffect(() => {
    fields.forEach((field) => {
      if (field.type === "select" && field.fetchOptions) {
        field
          .fetchOptions()
          .then((opts) => {
            setDynamicOptions((prev) => ({ ...prev, [field.name]: opts }));
          })
          .catch((err) =>
            console.error(`Failed to load options for ${field.name}`, err)
          );
      }
    });
  }, [fields]);


  // Validation Logic
  const validateField = (
    name: string,
    value: any,
    rules?: any
  ): string | null => {
    if (!rules) return null;
    if (
      rules.required &&
      (value === "" || value === null || value === undefined)
    )
      return rules.message || "Required";
    if (rules.min && typeof value === "number" && value < rules.min)
      return `Min value is ${rules.min}`;
    if (rules.pattern && !rules.pattern.test(value))
      return rules.message || "Invalid format";
    if (rules.custom) return rules.custom(value, values);
    return null;
  };

  // Handle Change
  const handleChange = (name: string, value: any) => {
    setValues((prev: any) => {
      const next = { ...prev, [name]: value };

      // Live Update Trigger
      if (liveUpdate) {
        // We use a small timeout or just direct call depending on preference.
        // For live update, we usually want to skip validation blocking or validate immediately.
        onSubmit(next);
      }
      return next;
    });

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form Submission
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    // Validate All
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(
        field.name,
        values[field.name],
        field.validation
      );
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      onSubmit(values);
    } else {
      toast.error("Please fix the validation errors.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-4 p-4 h-full overflow-y-auto", className)}
    >
      {fields.map((field) => {
        // Handle Conditional Visibility
        if (
          field.hidden &&
          (typeof field.hidden === "function"
            ? field.hidden(values)
            : field.hidden)
        ) {
          return null;
        }

        const error = errors[field.name];
        let fieldValue = values[field.name] ?? field.defaultValue ?? "";

        if (field.currentDataLoadConfig && !isCreating) {
          if (field.currentDataLoadConfig.useObjectKey) {
            fieldValue = getValue(values, field.currentDataLoadConfig.useObjectKey);
          } else if (field.currentDataLoadConfig.transform) {
            fieldValue = field.currentDataLoadConfig.transform(values);
          }
        }

        // test
        if (field.currentDataLoadConfig) {
          if (field.currentDataLoadConfig.useObjectKey) {
            console.log(
              "Temp Val:",
              getValue(values, field.currentDataLoadConfig.useObjectKey)
            );
          } else if (field.currentDataLoadConfig.transform) {
            console.log(
              "Temp Val:",
              field.currentDataLoadConfig.transform(values)
            );
          }
        }

        return (
          <div
            key={field.name}
            className={cn("flex flex-col gap-1.5", field.className)}
          >
            <Label className={cn(error && "text-destructive")}>
              {field.label}{" "}
              {field.validation?.required && (
                <span className="text-destructive">*</span>
              )}
            </Label>

            {/* INPUT: TEXT / EMAIL / NUMBER */}
            {["text", "email", "number", "password"].includes(field.type) && (
              <Input
                type={field.type}
                value={fieldValue}
                placeholder={field.placeholder}
                onChange={(e) => {
                  if (field.onChange) {
                    field.onChange(e);
                  }
                  handleChange(
                    field.name,
                    field.type === "number"
                      ? Number(e.target.value)
                      : e.target.value
                  );
                }}
                className={cn(error && "border-destructive")}
                disabled={field.disabled}
              />
            )}

            {/* INPUT: TEXTAREA */}
            {field.type === "textarea" && (
              <Textarea
                value={fieldValue}
                placeholder={field.placeholder}
                onChange={(e) => {
                  if (field.onChange) {
                    field.onChange(e);
                  }
                  handleChange(field.name, e.target.value);
                }}
                className={cn(error && "border-destructive")}
                disabled={field.disabled}
              />
            )}

            {/* INPUT: SELECT */}
            {field.type === "select" && (
              <select
                className={cn(
                  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  error && "border-destructive"
                )}
                value={fieldValue?.id ?? null}
                onChange={(e) => {
                  if (field.onChange) {
                    field.onChange(e);
                  }
                  handleChange(field.name, e.target.value);
                }}
                disabled={field.disabled}
              >
                <option value="" disabled>
                  Select...
                </option>
                {(field.options || dynamicOptions[field.name] || []).map(
                  (opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  )
                )}
              </select>
            )}

            {/* INPUT: CHECKBOX */}
            {field.type === "checkbox" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!fieldValue}
                  onCheckedChange={(checked) => {
                    if (field.onChange) {
                      field.onChange(checked);
                    }
                    handleChange(field.name, checked);
                  }}
                  disabled={field.disabled}
                />
                <span className="text-sm text-muted-foreground">
                  {field.placeholder || "Enable"}
                </span>
              </div>
            )}

            {/* INPUT: DATE */}
            {field.type === "date" && (
              <div className="flex items-center space-x-2">
                <DatePicker
                  value={fieldValue as Date | undefined}
                  onChange={(date) => {
                    if (field.onChange) {
                      field.onChange(date);
                    }
                    handleChange(field.name, date ?? null);
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  {field.placeholder || "Select date"}
                </span>
              </div>
            )}

            {/* INPUT: CUSTOM */}
            {field.type === "custom" &&
              field.renderCustom &&
              field.renderCustom({
                value: fieldValue,
                onChange: (v) => handleChange(field.name, v),
                error,
              })}

            {/* INPUT: IMAGE (Simplified for brevity - Add Drag/Drop here as needed) */}
            {field.type === "image" && (
              <div className="border border-dashed p-4 rounded-md text-center">
                {fieldValue ? (
                  <div className="relative w-full h-32 bg-gray-100 mb-2 rounded-md overflow-hidden">
                    <img
                      src={
                        typeof fieldValue === "string"
                          ? fieldValue
                          : URL.createObjectURL(fieldValue)
                      }
                      alt="preview"
                      className="object-contain h-full w-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleChange(field.name, null)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 text-xs"
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (field.onChange) {
                        field.onChange(e);
                      }

                      if (file) {
                        // If uploadEndpoint exists, you would upload here and set URL
                        // For now we set File object
                        handleChange(field.name, file);
                      }
                    }}
                  />
                )}
              </div>
            )}

            {/* VALIDATION MESSAGE */}
            {error && <span className="text-xs text-destructive">{error}</span>}
          </div>
        );
      })}

      {!liveUpdate && (
        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
};
