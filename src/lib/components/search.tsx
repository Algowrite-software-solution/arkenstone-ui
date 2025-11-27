import { SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";

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
    formClassName?: string;
    searchIconClassName?: string;
    searchButtonTextClassName?: string;
    placeholderTextClassName?: string;
    labelClassName?: string;
    leftSlotClassName?: string;
    rightSlotClassName?: string;
    searchContainerClassName?: string;
}

export default function Search({
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
    formClassName = "",
    searchIconClassName = "text-gray-600",
    searchButtonTextClassName = "max-h-full px-3 py-1 bg-gray-800 text-white rounded-sm text-sm",
    placeholderTextClassName = "text-left",
    labelClassName = "text-sm font-medium mb-1 block",
    leftSlotClassName = "",
    rightSlotClassName = "",
    searchContainerClassName = "flex items-center gap-2 border rounded-sm min-h-[40px] px-2 bg-white ",
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
        <button type="submit" className={`${searchIconClassName}`}>
            <SearchIcon size={18} />
        </button>
    );

    const renderTextButton = () => (
        <button
            type="submit"
            className={`${searchButtonTextClassName}`}
        >
            {buttonText}
        </button>
    );


    return (
        <form onSubmit={handleSubmit} className={`w-full ${formClassName ?? ""}`}>
            {label && (
                <label className={labelClassName}>
                    {label}
                </label>
            )}

            <div className={`${searchContainerClassName}`}>
                {leftSlot && <div className={`flex items-center ${leftSlotClassName}`}>{leftSlot}</div>}
            
                {/* LEFT CONTROLS */}
                {(buttonType === "icon" && searchIconPosition === "left") &&
                    renderIconButton()}
                
                {(buttonType === "text" && searchButtonTextPosition === "left") &&
                    renderTextButton()}

                {/* INPUT */}
                <input
                    type="text"
                    className={`flex-1 outline-none text-sm ${placeholderTextClassName}`}
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

                {rightSlot && <div className={`flex items-center ${rightSlotClassName}`}>{rightSlot}</div>}
            </div>
        </form>
    );
}
