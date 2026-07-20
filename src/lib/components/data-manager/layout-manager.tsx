import React from 'react';
import { LayoutType } from './types';
import { cn } from '@/lib/utils';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface LayoutManagerProps {
    type: LayoutType;
    children: React.ReactNode; // Usually the DataDisplay
    detailsPanel: React.ReactNode; // usually the GenericForm
    isDetailsOpen: boolean;
    onCloseDetails: () => void;
    title?: string;
    modalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const LayoutManager: React.FC<LayoutManagerProps> = ({
    type,
    children,
    detailsPanel,
    isDetailsOpen,
    onCloseDetails,
    title,
    modalSize = 'md'
}) => {

    // --- LAYOUT: SPLIT VIEW (Sidebar List, Main Details) ---
    if (type === 'split-view') {
        return (
            <div className="flex h-max w-full gap-4 overflow-hidden">
                {/* Left Panel: List - Collapses on mobile if details open */}
                <div className={cn(
                    "flex-1 overflow-y-auto max-w-full border rounded-xl transition-all duration-300",
                    isDetailsOpen ? "hidden lg:block lg:w-1/2 lg:flex-none" : "w-full"
                )}>
                    {children}
                </div>

                {/* Right Panel: Details */}
                {isDetailsOpen && (
                    <div className="flex-1 border rounded-xl bg-background overflow-hidden flex flex-col shadow-sm animate-in fade-in slide-in-from-right-4 lg:w-1/2 w-full max-w-full">
                        <div className="flex justify-between items-center p-3 sm:p-4 border-b bg-muted/20">
                            <div className="flex items-center gap-2">
                                {/* Back Arrow shown only on mobile/tablet */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 lg:hidden cursor-pointer shrink-0"
                                    onClick={onCloseDetails}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <h3 className="font-semibold text-foreground truncate">{title || "Details"}</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onCloseDetails}
                                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer rounded-full shrink-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            {detailsPanel}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- LAYOUT: MODAL (List Full Width, Details in Popup) ---
    if (type === 'modal') {

        // Map sizes to responsive Tailwind classes
        const sizeClasses = {
            sm: "sm:max-w-sm",
            md: "sm:max-w-lg", // Default shadcn size
            lg: "sm:max-w-2xl",
            xl: "sm:max-w-4xl", // Wider
            full: "w-[95vw] max-w-none" // Almost full screen
        };

        return (
            <div className="w-full h-full max-w-full">
                {children}
                <Dialog open={isDetailsOpen} onOpenChange={(open) => !open && onCloseDetails()}>
                    <DialogContent
                        className={cn(
                            "overflow-hidden flex flex-col max-h-[90vh] max-w-[95vw] sm:w-full p-4 sm:p-6", // Ensure internal scrolling works and doesn't spill off page; responsive padding
                            sizeClasses[modalSize]
                        )}
                    >
                        <DialogHeader>
                            <DialogTitle className="truncate pr-6">{title || "Details"}</DialogTitle>
                        </DialogHeader>

                        {/* Container to handle scrolling for long forms */}
                        <div className="overflow-y-auto pr-2 max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] h-auto w-full">
                            {detailsPanel}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    // Fallback
    return <div>{children}</div>
};