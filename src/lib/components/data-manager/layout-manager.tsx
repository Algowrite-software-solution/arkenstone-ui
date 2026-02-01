import React from 'react';
import { LayoutType } from './types';
import { cn } from '@/lib/utils';
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
                    "flex-1 overflow-y-auto border rounded-xl transition-all duration-300",
                    isDetailsOpen ? "hidden lg:block lg:w-1/2 lg:flex-none" : "w-full"
                )}>
                    {children}
                </div>

                {/* Right Panel: Details */}
                {isDetailsOpen && (
                    <div className="flex-1 border rounded-xl bg-background overflow-hidden flex flex-col shadow-sm animate-in fade-in slide-in-from-right-4 lg:w-1/2 w-full">
                        <div className="flex justify-between items-center p-4 border-b bg-muted/20">
                            <h3 className="font-semibold">{title || "Details"}</h3>
                            <button onClick={onCloseDetails} className="text-2xl hover:text-red-500">&times;</button>
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

        // Map sizes to Tailwind classes that override your default Dialog styles
        const sizeClasses = {
            sm: "sm:max-w-sm max-h-[80vh]",
            md: "sm:max-w-lg max-h-[80vh]", // Default shadcn size
            lg: "sm:max-w-2xl max-h-[80vh]",
            xl: "sm:max-w-4xl max-h-[80vh]", // Wider
            full: "w-[95vw] h-[95vh] max-w-none sm:max-w-none" // Almost full screen
        };


        return (
            <div className="w-full h-full">
                {children}
                <Dialog open={isDetailsOpen} onOpenChange={(open) => !open && onCloseDetails()}>
                    <DialogContent
                        className={cn(
                            "overflow-auto flex flex-col", // Ensure internal scrolling works
                            sizeClasses[modalSize], // Apply size override
                            modalSize === 'full' && "h-[95vh]" // Ensure height for full mode
                        )}
                    >
                        <DialogHeader>
                            <DialogTitle>{title || "Details"}</DialogTitle>
                        </DialogHeader>

                        {/* Container to handle scrolling for long forms */}
                        <div className="flex-1 overflow-y-auto -mr-6 pr-6">
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