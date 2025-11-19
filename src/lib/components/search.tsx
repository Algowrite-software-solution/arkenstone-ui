import { SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";

export interface SearchProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    debounce?: number;
    label?: string;
    className?: string;
    rightSlot?: React.ReactNode;
    leftSlot?: React.ReactNode;

    // NEW PROPS
    buttonType?: "icon" | "text" | "none";
    buttonText?: string;
    searchIconPosition?: "left" | "right";
    searchButtonTextPosition?: "left" | "right";
    placeholderTextPosition?: "left" | "center" | "right";
}

export default function Search({
    placeholder = "Search...",
    value = "",
    onChange,
    onSubmit,
    debounce = 0,
    label,
    className,
    rightSlot,
    leftSlot,

    // NEW DEFAULTS
    buttonType = "icon",
    buttonText = "Search",
    searchIconPosition = "left",
    searchButtonTextPosition = "right",
    placeholderTextPosition = "left",
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
        <button type="submit" className="text-gray-600">
            <SearchIcon size={18} />
        </button>
    );

    const renderTextButton = () => (
        <button
            type="submit"
            className="max-h-full px-3 py-1 bg-gray-800 text-white rounded-sm text-sm"
        >
            {buttonText}
        </button>
    );

    const placeholderAlignClass =
        placeholderTextPosition === "center"
            ? "text-center"
            : placeholderTextPosition === "right"
            ? "text-right"
            : "text-left";

    return (
        <form onSubmit={handleSubmit} className={`w-full ${className ?? ""}`}>
            {label && (
                <label className="text-sm font-medium mb-1 block">
                    {label}
                </label>
            )}

            <div className="flex items-center gap-2 border rounded-sm min-h-[40px] px-2 bg-white">
                {leftSlot && <div className="flex items-center">{leftSlot}</div>}

                {/* LEFT CONTROLS */}
                {(buttonType === "icon" && searchIconPosition === "left") &&
                    renderIconButton()}
                
                {(buttonType === "text" && searchButtonTextPosition === "left") &&
                    renderTextButton()}

                {/* INPUT */}
                <input
                    type="text"
                    className={`flex-1 outline-none text-sm ${placeholderAlignClass}`}
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

                {rightSlot && <div className="flex items-center">{rightSlot}</div>}
            </div>
        </form>
    );
}
