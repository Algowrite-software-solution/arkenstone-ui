import { AccessGate, AccessGateProps } from "./access-gate";

export function AccessValidation({
    userRoles,
    accessor,
    matchAll,
    behavior,
    fallback,
    children
}: AccessGateProps) {
    return ( 
        <div className="bg-slate-400 p-10 rounded-lg text-center">
            <h1 className="text-2xl font-bold text-white">Access Validation</h1>

            <AccessGate
                userRoles={userRoles}
                accessor={accessor}
                matchAll={matchAll}
                behavior={behavior}
                fallback={fallback}
            >
                {children}
            </AccessGate>
        </div>
    );
}