import type { ReactNode } from "react";

export type CatalogLayoutProps = {
    top?: ReactNode | false;
    bottom?: ReactNode | false;

    left?: ReactNode | false;
    right?: ReactNode | false;

    listings?: ReactNode | false; // main center section
};

export default function CatalogContentLayout({
    top,
    left,
    listings,
    right,
    bottom,
}: CatalogLayoutProps) {
    return (
        <div className="w-full flex flex-col gap-6">
            {/* ---------- TOP SECTION ---------- */}
            {top !== false && top && (
                <div className="w-full">{top}</div>
            )}

            {/* ---------- MIDDLE SECTION ---------- */}
            <div className="w-full grid grid-cols-12 gap-6">

                {/* ----- LEFT ----- */}
                {left !== false && left && (
                    <aside className="col-span-3">
                        {left}
                    </aside>
                )}

                {/* ----- CENTER LISTINGS ----- */}
                {listings !== false && (
                    <main className={left && right ? "col-span-6" : left || right ? "col-span-9" : "col-span-12"}>
                        {listings}
                    </main>
                )}

                {/* ----- RIGHT ----- */}
                {right !== false && right && (
                    <aside className="col-span-3">
                        {right}
                    </aside>
                )}

            </div>

            {/* ---------- BOTTOM SECTION ---------- */}
            {bottom !== false && bottom && (
                <div className="w-full">{bottom}</div>
            )}
        </div>
    );
}
