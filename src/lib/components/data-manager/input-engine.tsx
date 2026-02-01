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
import { MediaInput } from "./media-input";
import { apiDelete, apiPost } from "@/hooks";

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
  updateFormValues?: {
    data: any;
    loadData: boolean;
  };
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
  updateFormValues = {
    data: {},
    loadData: false,
  },
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

  // update the form inputs only when the updateFormInputs is manually changed. not when the inital load
  useEffect(() => {
    if (updateFormValues.loadData) {
      // update only the props existing in updateFormValues.data into values
      setValues((prev: any) => ({ ...prev, ...updateFormValues.data }));
    }
  }, [updateFormValues.loadData]);

  // Watch for initial value changes (e.g. when an item is selected from list)
  useEffect(() => {
    const nextValues = { ...(initialValues || {}) };

    // Pre-populate fields based on configuration (Flattening logic)
    if (!isCreating) {
      fields.forEach(field => {
        if (field.currentDataLoadConfig) {
          let val = undefined;
          if (field.currentDataLoadConfig.useObjectKey) {
            val = getValue(nextValues, field.currentDataLoadConfig.useObjectKey);
          } else if (field.currentDataLoadConfig.transform) {
            val = field.currentDataLoadConfig.transform(nextValues);
          }

          if (val !== undefined) {
            nextValues[field.name] = val;
          }
        }
      });
    }

    setValues(nextValues);
    setErrors({});
  }, [initialValues, isCreating]);
  // removed 'fields' from dependency array to prevent loops if fields is not memoized, 
  // though generally it should be included if dynamic. 
  // Assuming fields structure doesn't change drastically mid-editing without isCreating/initialValues change.

  // Fetch Dynamic Options & Auto-Select First Option Logic
  useEffect(() => {
    fields.forEach((field) => {
      // 1. Handle Dynamic Options
      if (field.type === "select" && field.fetchOptions) {
        field
          .fetchOptions()
          .then((opts) => {
            setDynamicOptions((prev) => ({ ...prev, [field.name]: opts }));

            // Check if we need to auto-select the first value after fetching
            setValues((prevValues: any) => {
              const currentValue = prevValues[field.name];
              // If no value is selected, and we have options, and no "placeholder" (defaultOption) is enabled
              if (
                (currentValue === undefined ||
                  currentValue === null ||
                  currentValue === "") &&
                opts.length > 0 &&
                !field.defaultOption
              ) {
                return { ...prevValues, [field.name]: opts[0].value };
              }
              return prevValues;
            });
          })
          .catch((err) =>
            console.error(`Failed to load options for ${field.name}`, err),
          );
      }

      // 2. Handle Static Options (Auto-select first if empty)
      if (
        field.type === "select" &&
        field.options &&
        field.options.length > 0
      ) {
        setValues((prevValues: any) => {
          const currentValue = prevValues[field.name];
          if (
            (currentValue === undefined ||
              currentValue === null ||
              currentValue === "") &&
            !field.defaultOption
          ) {
            return { ...prevValues, [field.name]: field.options![0].value };
          }
          return prevValues;
        });
      }
    });
  }, [fields]);

  // Validation Logic
  const validateField = (
    name: string,
    value: any,
    rules?: any,
  ): string | null => {
    if (!rules) return null;
    if (
      rules.required &&
      isCreating &&
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
        field.validation,
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
        if (field.currentDataLoadConfig && !isCreating) {
          // Logic moved to initialization, so we just use the value from state
          // No need to override fieldValue here anymore unless for display transformations not stored in state
        }

        const fieldValue = values[field.name] ?? field.defaultValue ?? "";

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
                      : e.target.value,
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
                  error && "border-destructive",
                )}
                value={fieldValue ?? ""}
                onChange={(e) => {
                  if (field.onChange) {
                    field.onChange(e);
                  }
                  handleChange(field.name, e.target.value);
                }}
                disabled={field.disabled}
              >
                {field.defaultOption && (
                  <option
                    value={
                      typeof field.defaultOption === "function"
                        ? field.defaultOption().value
                        : field.defaultOption.value
                    }
                    disabled={field.enableDefaultOption ? false : true}
                  >
                    {typeof field.defaultOption === "function"
                      ? field.defaultOption().label
                      : field.defaultOption.label}
                  </option>
                )}
                {(field.options || dynamicOptions[field.name] || []).map(
                  (opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ),
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

            {/* INPUT: IMAGE with Drag & Drop & Multi-support */}
            {field.type === "image" && (
              <Input
                className="hidden" // Hidden input for form data if needed, but we mainy use the MediaInput
                name={field.name}
              />
            )}

            {field.type === "image" && (
              <MediaInput
                value={Array.isArray(fieldValue) ? fieldValue : (fieldValue ? [fieldValue] : [])}
                onChange={(newFiles) => {
                  handleChange(field.name, newFiles)
                }}
                onRemove={(removedItem) => {
                  const removedKey = field.removeImageOptions?.removedImagesField || 'removed_images';

                  // If it's a string (URL), track it as removed
                  if (typeof removedItem === 'string') {
                    setValues((prev: any) => {
                      const currentRemoved = prev[removedKey] || [];
                      // Add only if not already there
                      if (!currentRemoved.includes(removedItem)) {
                        return { ...prev, [removedKey]: [...currentRemoved, removedItem] };
                      }
                      return prev;
                    });
                  }

                  // if remove endpoint is provided, call it
                  if (field.removeImageOptions?.removeEndpoint && typeof removedItem === 'string') {
                    apiPost(field.removeImageOptions.removeEndpoint, {
                      data: {
                        removedKey: removedItem
                      }
                    });
                  }
                }}
                previewOptions={field.previewOptions}
                maxCount={field.maxCount}
                maxSize={field.maxSize}
                accept={field.accept}
                disabled={field.disabled}
              />
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
