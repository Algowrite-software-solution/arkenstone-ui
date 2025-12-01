import { useAccess } from "@/hooks/use-access";
import { AccessGate, AccessGateProps } from "../lib/components/access-gate";
import { useACLStore } from "@/stores/acl.store";
import { Arkenstone } from "../lib/components/arkestone";

export function AccessValidation({
  userRoles,
  accessor,
  matchAll,
  behavior,
  fallback,
  children,
}: AccessGateProps) {
  const { config } = useACLStore();
  const { can, isReady, must } = useAccess(["admin"]);

  return (
    <Arkenstone>
      <div className="bg-slate-800 p-10 rounded-lg text-center">
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

        <hr />

        <code className="text-white">{JSON.stringify(config, null, 2)}</code>

        <hr />

        <div className="text-gray-400">
          <p>can: {can(accessor) ? "true" : "false"}</p>
          <p>isReady: {isReady ? "true" : "false"}</p>
        </div>
      </div>
    </Arkenstone>
  );
}
