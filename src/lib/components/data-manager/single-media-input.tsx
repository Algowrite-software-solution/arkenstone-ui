import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface SingleMediaInputProps {
    value?: File | string | null;
    onChange: (file: File | null) => void;
    maxSize?: number; // in MB
    accept?: string;
    disabled?: boolean;
    className?: string;
    previewOptions?: {
        key?: string;
        transform?: (file: any) => any;
    };
}

export const SingleMediaInput: React.FC<SingleMediaInputProps> = ({
    value,
    onChange,
    maxSize = 2,
    accept = "image/*",
    disabled = false,
    className,
    previewOptions,
}) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Generate preview
    useEffect(() => {
        if (!value) {
            setPreview(null);
            return;
        }

        let url: string | null = null;

        if (typeof value === "string") {
            url = value;
        } else if (value instanceof File) {
            url = URL.createObjectURL(value);
        } else if (value instanceof Object && previewOptions?.transform) {
            url = previewOptions.transform(value);
        } else if (value instanceof Object && previewOptions?.key) {
            url = (value as any)?.[previewOptions.key];
        }

        setPreview(url);

        return () => {
            if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
        };
    }, [value, previewOptions]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (disabled) return;

            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];
            const sizeInMB = file.size / (1024 * 1024);

            if (sizeInMB > maxSize) {
                toast.error(`${file.name} exceeds the ${maxSize}MB limit.`);
                return;
            }

            onChange(file);
        },
        [maxSize, onChange, disabled]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept ? { [accept]: [] } : undefined,
        disabled: disabled,
        maxFiles: 1, // Strict single file
        multiple: false,
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;
        onChange(null);
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-lg transition-colors text-center cursor-pointer flex flex-col items-center justify-center min-h-[200px] overflow-hidden group",
                    isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50",
                    disabled && "opacity-50 cursor-not-allowed",
                    preview ? "border-solid border-border p-0" : "p-6"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <>
                        <ImageModal image={preview} >
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-contain max-h-[300px]"
                            />
                        </ImageModal>

                        {/* Overlay with Change/Remove actions */}
                        <div className={cn(
                            "absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity",
                            isHovered && !disabled ? "opacity-100" : "opacity-0"
                        )}>
                            <p className="text-white text-sm font-medium">Click or Drop to Replace</p>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-muted p-4 rounded-full mb-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {isDragActive ? (
                                <p>Drop the image here ...</p>
                            ) : (
                                <p>Drag & drop an image, or click to select</p>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Max size: {maxSize}MB
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

const ImageModal = ({ image, children }: { image: string, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <div
                className="w-full h-full"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                }}
            >
                {children}
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
