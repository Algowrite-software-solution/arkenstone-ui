import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CatalogLayoutProps = {
    top?: ReactNode | false;
    bottom?: ReactNode | false;

    left?: ReactNode | false;
    right?: ReactNode | false;

    listings?: ReactNode | false; 
    
    classNames?: {
        container?: string;
        top?: string;
        center?: string;
        bottom?: string;
        left?: string;
        right?: string;
        listings?: string;
    }
};

export function CatalogContentLayout({
    top,
    left,
    listings,
    right,
    bottom,
    classNames,
}: CatalogLayoutProps) {
    return (
        <div className="w-full flex flex-col gap-6">
            {/* ---------- TOP SECTION ---------- */}
            {top !== false && top && (
                <div className={cn("w-full",classNames?.top)}>{top}</div>
            )}

            {/* ---------- MIDDLE SECTION ---------- */}
            <div className={cn("w-full grid grid-cols-12 gap-6", classNames?.center)}>
                {/* ----- LEFT ----- */}
                {left !== false && left && (
                    <aside className={cn("col-span-3", classNames?.left)}>
                        {left}
                    </aside>
                )}

                {/* ----- CENTER LISTINGS ----- */}
                {listings !== false && (
                    <main className={cn(left && right ? "col-span-6" : left || right ? "col-span-9" : "col-span-12", classNames?.listings)}>
                        {listings}
                    </main>
                )}

                {/* ----- RIGHT ----- */}
                {right !== false && right && (
                    <aside className={cn("col-span-3", classNames?.right)}>
                        {right}
                    </aside>
                )}

            </div>

            {/* ---------- BOTTOM SECTION ---------- */}
            {bottom !== false && bottom && (
                <div className={cn("w-full", classNames?.bottom)}>{bottom}</div>
            )}
        </div>
    );
}
