import { useACLStore } from "../stores/acl.store";
import { Accessor, Role } from "../types/acl";

export const useAccess = (userRoles: Role[] = []) => {
    const {check, isReady} = useACLStore();

    // const check = useACLStore((state: ACLStore) => state.check);
    // const isReady = useACLStore((state: ACLStore) => state.isReady);

    const can = (accessor: Accessor | Accessor[], matchAll: boolean = false): boolean => {
        if (!isReady || userRoles.length === 0) return false;
        return check(userRoles, accessor, matchAll);
    };

    const must = (accessor: Accessor | Accessor[], message: string = "Access Denied") => {
        if (!can(accessor)) {
            throw new Error(message);
        }
    };

    const canRender = (component: React.ReactNode, accessor: Accessor | Accessor[], matchAll: boolean = false): React.ReactNode => {
        return check(userRoles, accessor, matchAll) ? component : null;
    };

    return { can, must, isReady, canRender };
};