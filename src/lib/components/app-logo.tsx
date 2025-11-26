import React from 'react';
import { cn } from '../util/utils';
import { ClassNameValue } from 'tailwind-merge';
import { Star } from 'lucide-react';

export default function AppLogo({
    icon,
    name,
    iconOnly = false,
    showText = true,
    classNameIcon,
    classNameText,
}: {
    icon?: React.ReactNode;
    name?: string;
    iconOnly?: boolean;    
    showText?: boolean;    
    classNameIcon?: ClassNameValue;
    classNameText?: ClassNameValue;
}) {
    return (
        <div className="flex items-center gap-2">
            <div className={cn('text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-md', classNameIcon)}>
                {icon ?? (
                    /* default placeholder icon if none provided */
                    <Star />
                )}
            </div>

            {!iconOnly && showText && name && (
                <div className="grid flex-1 text-left text-sm font-serif">
                    <span className={cn('truncate leading-none font-semibold', classNameText)}>
                        {name}
                    </span>
                </div>
            )}
        </div>
    );
}
