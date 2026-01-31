import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, File as FileIcon, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface MediaInputProps {
    value?: (File | string)[];
    onChange: (files: (File | string)[]) => void;
    onRemove?: (removedItem: File | string) => void;
    maxCount?: number;
    maxSize?: number; // in MB
    accept?: string;
    disabled?: boolean;
    className?: string;
    previewOptions?: {
        key: string;
        transform?: (file: any) => any;
    };
}

export const MediaInput: React.FC<MediaInputProps> = ({
    value = [],
    onChange,
    onRemove,
    maxCount = 5,
    maxSize = 2,
    accept = "image/*",
    disabled = false,
    className,
    previewOptions,
}) => {
    const [previews, setPreviews] = useState<(string | null)[]>([]);

    // Generate previews for Files
    useEffect(() => {

        const newPreviews = value.map((file: any) => {
            if (typeof file === "string") {
                return file
            };
            if (file instanceof File) {
                return URL.createObjectURL(file)
            };
            if (file instanceof Object && previewOptions?.transform) {
                return previewOptions.transform(file);
            }
            if (file instanceof Object && previewOptions?.key) {
                return file?.[previewOptions.key];
            }
            return null;
        });

        setPreviews(newPreviews);

        // Cleanup object URLs to avoid memory leaks
        return () => {
            newPreviews.forEach((url) => {
                if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
            });
        };
    }, [value]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (disabled) return;

            const currentCount = value.length;
            const remainingSlots = maxCount - currentCount;

            if (remainingSlots <= 0) {
                toast.error(`You can only upload up to ${maxCount} images.`);
                return;
            }

            const filesToAdd = acceptedFiles.slice(0, remainingSlots);

            if (filesToAdd.length < acceptedFiles.length) {
                toast.info(`Only added ${filesToAdd.length} files due to limit.`);
            }

            const validFiles = filesToAdd.filter(file => {
                const sizeInMB = file.size / (1024 * 1024);
                if (sizeInMB > maxSize) {
                    toast.error(`${file.name} exceeds the ${maxSize}MB limit.`);
                    return false;
                }
                return true;
            })

            if (validFiles.length > 0) {
                onChange([...value, ...validFiles]);
            }
        },
        [value, maxCount, maxSize, onChange, disabled],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept ? { [accept]: [] } : undefined,
        disabled: disabled || value.length >= maxCount,
        maxFiles: maxCount,
    });

    const handleRemove = (index: number) => {
        if (disabled) return;
        const itemToRemove = value[index];
        const newValue = [...value];
        newValue.splice(index, 1);
        const imageFiles = newValue.filter(f => !(typeof f === 'string'));
        onChange(imageFiles);
        if (onRemove) onRemove(itemToRemove);
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 transition-colors text-center cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[120px]",
                    isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50",
                    disabled && "opacity-50 cursor-not-allowed",
                    value.length >= maxCount && "opacity-50 cursor-not-allowed hidden" // Optional: hide dropzone if full
                )}
            >
                <input {...getInputProps()} />
                <div className="bg-muted p-3 rounded-full">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-sm text-muted-foreground">
                    {isDragActive ? (
                        <p>Drop the files here ...</p>
                    ) : (
                        <p>Drag & drop up to {maxCount} images, or click to select</p>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    Max size: {maxSize}MB
                </p>
            </div>

            {/* Preview Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {value.map((item, index) => {
                        const previewUrl = previews[index];
                        const isFile = item instanceof File;

                        return (
                            <div
                                key={index}
                                className="relative group aspect-square rounded-lg border bg-background overflow-hidden"
                            >
                                {previewUrl ? (
                                    <ImageModal image={previewUrl} />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-muted">
                                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="absolute top-1 right-1 h-6 w-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                                    disabled={disabled}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                                {isFile && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 truncate px-2">
                                        New Upload
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};



const ImageModal = ({ image }: { image: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <div
                className="w-full h-full cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent duplicate triggers if inside other clickables
                    setIsOpen(true);
                }}
            >
                <img
                    src={image}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-lg"
                />
            </div>

            <DialogContent className="max-w-screen-lg w-full max-h-[90vh] h-auto p-0 bg-transparent border-none shadow-none flex items-center justify-center">
                <DialogHeader className="sr-only">
                    <DialogTitle>Image Preview</DialogTitle>
                </DialogHeader>
                <div className="relative w-auto h-auto max-w-full max-h-full overflow-hidden rounded-md">
                    <img
                        src={image}
                        alt="Preview"
                        className="w-auto h-auto max-w-[85vw] max-h-[85vh] object-contain"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};