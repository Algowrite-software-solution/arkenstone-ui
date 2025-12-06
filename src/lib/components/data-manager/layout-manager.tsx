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
}

export const LayoutManager: React.FC<LayoutManagerProps> = ({
    type,
    children,
    detailsPanel,
    isDetailsOpen,
    onCloseDetails,
    title
}) => {
    
    // --- LAYOUT: SPLIT VIEW (Sidebar List, Main Details) ---
    if (type === 'split-view') {
        return (
            <div className="flex h-max w-full gap-4 overflow-hidden">
                {/* Left Panel: List - Collapses on mobile if details open */}
                <div className={cn(
                    "flex-1 overflow-y-auto border rounded-xl transition-all duration-300",
                    isDetailsOpen ? "hidden md:block md:w-1/2 md:flex-none" : "w-full"
                )}>
                    {children}
                </div>
                
                {/* Right Panel: Details */}
                {isDetailsOpen && (
                    <div className="flex-1 border rounded-xl bg-background overflow-hidden flex flex-col shadow-sm animate-in fade-in slide-in-from-right-4">
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
        return (
            <div className="w-full h-full">
                {children}
                <Dialog open={isDetailsOpen} onOpenChange={(open) => !open && onCloseDetails()}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{title || "Details"}</DialogTitle>
                        </DialogHeader>
                        {detailsPanel}
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
    
    // Fallback
    return <div>{children}</div>
};