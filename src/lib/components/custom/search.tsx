import { SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface SearchProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    debounce?: number;
    label?: string;
    rightSlot?: React.ReactNode;
    leftSlot?: React.ReactNode;

    // CONTROLS
    buttonType?: "icon" | "text" | "none";
    buttonText?: string;
    searchIconPosition?: "left" | "right";
    searchButtonTextPosition?: "left" | "right";

    // STYLING
    classNames?: {
        form?: string;
        searchIcon?: string;
        searchButtonText?: string;
        placeholderText?: string;
        label?: string;
        leftSlot?: string;
        rightSlot?: string;
        searchContainer?: string;
    }
}

export function Search({
    placeholder = "Search...",
    value = "",
    onChange,
    onSubmit,
    debounce = 0,
    label,
    rightSlot,
    leftSlot,

    // CONTROLS
    buttonType = "icon",
    buttonText = "Search",
    searchIconPosition = "left",
    searchButtonTextPosition = "right",

    // STYLING
    classNames = {},
}: SearchProps) {
    const [internalValue, setInternalValue] = useState(value);

    useEffect(() => setInternalValue(value), [value]);

    useEffect(() => {
        if (!debounce || !onChange) return;
        const timeout = setTimeout(() => onChange(internalValue), debounce);
        return () => clearTimeout(timeout);
    }, [internalValue]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit?.(internalValue);
        if (!debounce) onChange?.(internalValue);
    }

    const renderIconButton = () => (
        <button type="submit" className={cn("text-gray-600", classNames.searchIcon)}>
            <SearchIcon size={18} />
        </button>
    );

    const renderTextButton = () => (
        <button
            type="submit"
            className={cn("max-h-full px-3 py-1 bg-gray-800 text-white text-sm", classNames.searchButtonText)}
        >
            {buttonText}
        </button>
    );


    return (
        <form onSubmit={handleSubmit} className={cn("w-full", classNames.form)}>
            {label && (
                <label className={cn("text-sm font-medium mb-1 block", classNames.label)}>
                    {label}
                </label>
            )}

            <div className={cn("flex items-center gap-2 min-h-[40px] px-2 bg-white ",classNames.searchContainer)}>
                {leftSlot && <div className={cn("flex items-center", classNames.leftSlot)}>{leftSlot}</div>}
            
                {/* LEFT CONTROLS */}
                {(buttonType === "icon" && searchIconPosition === "left") &&
                    renderIconButton()}
                
                {(buttonType === "text" && searchButtonTextPosition === "left") &&
                    renderTextButton()}

                {/* INPUT */}
                <input
                    type="text"
                    className={cn("flex-1 outline-none text-sm text-left", classNames.placeholderText)}
                    placeholder={placeholder}
                    value={internalValue}
                    onChange={(e) => {
                        setInternalValue(e.target.value);
                        if (!debounce) onChange?.(e.target.value);
                    }}
                />

                {/* RIGHT CONTROLS */}
                {(buttonType === "icon" && searchIconPosition === "right") &&
                    renderIconButton()}

                {(buttonType === "text" && searchButtonTextPosition === "right") &&
                    renderTextButton()}

                {rightSlot && <div className={cn("flex items-center", classNames.rightSlot)}>{rightSlot}</div>}
            </div>
        </form>
    );
}
