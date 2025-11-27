import React from "react";
import { useAccess } from "../hooks/use-access";
import { Accessor, Role } from "../types/acl";

export interface AccessGateProps {
    userRoles: Role[];
    accessor: Accessor | Accessor[]; // The Role, Group, or Permission required
    matchAll?: boolean; // If array passed, do we need ALL or ANY?
    behavior?: 'hide' | 'disable';
    fallback?: React.ReactNode; // What to show if hidden (optional)
    children: React.ReactNode;
}

export const AccessGate: React.FC<AccessGateProps> = ({
    userRoles,
    accessor,
    matchAll = false,
    behavior = 'hide',
    fallback = null,
    children
}) => {
    const { can } = useAccess(userRoles);
    const hasAccess = can(accessor, matchAll);

    // 1. Access Granted -> Render Children
    if (hasAccess) {
        return <>{children}</>;
    }

    // 2. Access Denied + 'disable' -> Render Children with styling
    if (behavior === 'disable') {
        return (
            <div 
                className="opacity-50 pointer-events-none select-none grayscale" 
                aria-disabled="true"
                title="Access Denied"
            >
                {children}
            </div>
        );
    }

    // 3. Access Denied + 'hide' -> Render Fallback
    return <>{fallback}</>;
};