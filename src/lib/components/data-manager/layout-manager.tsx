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

    const [isMobile, setIsMobile] = React.useState(false);
    const [visible, setVisible] = React.useState(isDetailsOpen);
    const [animatingClose, setAnimatingClose] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    React.useEffect(() => {
        if (isDetailsOpen) {
            setVisible(true);
            setAnimatingClose(false);
        } else if (visible) {
            setAnimatingClose(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setAnimatingClose(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isDetailsOpen, visible]);

    const displayDetails = visible || animatingClose;

    // --- LAYOUT: SPLIT VIEW (Sidebar List, Main Details) ---
    if (type === 'split-view') {
        return (
            <div 
                className="flex h-max w-full gap-2 overflow-hidden"
                style={{
                    display: 'flex',
                    width: '100%',
                    gap: '8px',
                    overflow: 'hidden',
                }}
            >
                <style>{`
                    @keyframes expandPanel {
                        from { width: 0; opacity: 0; }
                        to { width: 50%; opacity: 1; }
                    }
                    @keyframes collapsePanel {
                        from { width: 50%; opacity: 1; }
                        to { width: 0; opacity: 0; }
                    }
                    @media (min-width: 1024px) {
                        .animate-expand-panel {
                            animation: expandPanel 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
                        }
                        .animate-collapse-panel {
                            animation: collapsePanel 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
                        }
                    }
                `}</style>
                <div 
                    className={cn(
                        "flex-1 overflow-y-auto max-w-full border rounded-xl transition-[width] duration-300",
                        isDetailsOpen ? "hidden lg:block lg:w-1/2 lg:flex-none" : "w-full"
                    )}
                    style={{
                        flex: displayDetails && !isMobile ? 'none' : 1,
                        width: isDetailsOpen && !isMobile ? '50%' : '100%',
                        display: isDetailsOpen && isMobile ? 'none' : 'block',
                        overflowY: 'auto',
                        maxWidth: '100%',
                        borderRadius: '12px',
                        border: '1px solid hsl(var(--border))',
                    }}
                >
                    {children}
                </div>

                {/* Right Panel: Details */}
                {displayDetails && (
                    <div 
                        className={cn(
                            "flex-1 border rounded-xl bg-background overflow-hidden flex flex-col shadow-sm w-full max-w-full",
                            isMobile 
                                ? (animatingClose ? "animate-out fade-out slide-out-to-right-4 duration-300" : "animate-in fade-in slide-in-from-right-4") 
                                : (animatingClose ? "animate-collapse-panel" : "animate-expand-panel")
                        )}
                        style={{
                            flex: isMobile ? 1 : 'none',
                            width: isMobile ? '100%' : '50%',
                            maxWidth: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            borderRadius: '12px',
                            border: '1px solid hsl(var(--border))',
                            backgroundColor: 'hsl(var(--background))',
                        }}
                    >
                        <div 
                            className="flex justify-between items-center p-3 sm:p-4 border-b bg-muted/20"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: isMobile ? '12px' : '16px',
                                borderBottom: '1px solid hsl(var(--border))',
                            }}
                        >
                            <div 
                                className="flex items-center gap-2"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                {/* Back Arrow shown only on mobile/tablet */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 lg:hidden cursor-pointer shrink-0"
                                    onClick={onCloseDetails}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <h3 className="font-semibold text-foreground truncate" style={{ margin: 0 }}>{title || "Details"}</h3>
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
                        <div 
                            className="flex-1 overflow-hidden"
                            style={{
                                flex: 1,
                                overflow: 'hidden',
                            }}
                        >
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

        const sizeStyles = {
            sm: "384px",
            md: "448px",
            lg: "672px",
            xl: "896px",
            full: "95vw"
        };

        return (
            <div 
                className="w-full h-full max-w-full"
                style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                }}
            >
                {children}
                <Dialog modal={false} open={isDetailsOpen} onOpenChange={(open) => !open && onCloseDetails()}>
                    <DialogContent
                        className={cn(
                            "overflow-hidden flex flex-col max-h-[90vh] max-w-[95vw] sm:w-full p-4 sm:p-6", // Ensure internal scrolling works and doesn't spill off page; responsive padding
                            sizeClasses[modalSize]
                        )}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '90vh',
                            width: '95vw',
                            maxWidth: modalSize === 'full' ? '95vw' : (isMobile ? '95vw' : sizeStyles[modalSize]),
                            padding: isMobile ? '16px' : '24px',
                            overflow: 'hidden',
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            translate: '-50% -50%',
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            zIndex: 50,
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle className="truncate pr-6">{title || "Details"}</DialogTitle>
                        </DialogHeader>

                        {/* Container to handle scrolling for long forms */}
                        <div 
                            className="overflow-y-auto pr-2 max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] h-auto w-full"
                            style={{
                                overflowY: 'auto',
                                width: '100%',
                            }}
                        >
                            {detailsPanel}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    // --- LAYOUT: TAB-VIEW & FULLSCREEN (Replaces overview list completely for now) ---
    if (type === 'tab-view' || type === 'fullscreen') {
        if (isDetailsOpen) {
            return (
                <div 
                    className="w-full h-full min-h-[400px] border rounded-xl bg-background overflow-hidden flex flex-col shadow-sm animate-in fade-in duration-200"
                    style={{
                        width: '100%',
                        height: '100%',
                        minHeight: '400px',
                        borderRadius: '12px',
                        border: '1px solid hsl(var(--border))',
                        backgroundColor: 'hsl(var(--background))',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div 
                        className="flex justify-between items-center p-4 border-b bg-muted/20"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            borderBottom: '1px solid hsl(var(--border))',
                        }}
                    >
                        <div 
                            className="flex items-center gap-2"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 cursor-pointer shrink-0"
                                onClick={onCloseDetails}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h3 className="font-semibold text-foreground truncate" style={{ margin: 0 }}>{title || "Details"}</h3>
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
                    <div 
                        className="flex-1 overflow-y-auto p-4 sm:p-6 w-full max-w-full"
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: isMobile ? '16px' : '24px',
                            width: '100%',
                            maxWidth: '100%',
                        }}
                    >
                        {detailsPanel}
                    </div>
                </div>
            );
        }
        return (
            <div 
                className="w-full h-full max-w-full"
                style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                }}
            >
                {children}
            </div>
        );
    }

    // Fallback
    return <div style={{ width: '100%' }}>{children}</div>;
};