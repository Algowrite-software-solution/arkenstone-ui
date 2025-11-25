import { createGenericStore } from "../../lib/stores/store-factory";
import type { ACLState, ACLActions, ACLConfig, Role } from "../types/acl";

/**
 * Default Initial State for the fallbacks and initializations
 */
const initialState: ACLState = {
    config: { mode: 'local', groups: {}, permissions: {} },
    isReady: false
};

/**
 * ACL Store for managing the access related configrations and checks
 */
export const useACLStore = createGenericStore<ACLState, ACLActions>(
    initialState,
    {
        name: "acl-system", // Persist logic so config survives reload
        methods: (set, get) => ({

            /**
             * Initialize the ACL System
             */
            configure: async (incomingConfig: ACLConfig) => {
                let finalConfig = { ...incomingConfig };

                // Handle Remote Configuration
                if (incomingConfig.mode === 'remote' && incomingConfig.fetchRemoteConfig) {
                    try {
                        const remoteData = await incomingConfig.fetchRemoteConfig();
                        finalConfig.groups = { ...finalConfig.groups, ...remoteData.groups };
                        finalConfig.permissions = { ...finalConfig.permissions, ...remoteData.permissions };
                    } catch (e) {
                        console.error("ACL: Remote fetch failed", e);
                    }
                }

                set((state) => {
                    state.config = finalConfig;
                    state.isReady = true;
                });
            },

            /**
             * RuleSet Checker
             * The Core Logic Engine
             * returns TRUE if the user has access, FALSE otherwise
             */
            check: (userRoles: Role[], accessor: string | string[], matchAll: boolean = false) => {
                const state = get();
                const requirements = Array.isArray(accessor) ? accessor : [accessor];

                if (!state.isReady) return false;

                // Helper: Evaluate a single requirement against user roles
                const checkSingle = (req: string) => {

                    //  RULE SET

                    // 1. Direct Role Match
                    if (userRoles.includes(req)) return true;

                    // 2. Group Match (e.g. req="staff", group=["admin", "editor"], user="admin")
                    const groupRoles = state.config.groups?.[req];
                    if (groupRoles) {
                        // Check if ANY of the user's roles are in this group
                        if (userRoles.some(r => groupRoles.includes(r))) return true;
                    }

                    // 3. Permission Match (e.g. req="product.create")
                    // Check if ANY of the user's roles have this permission
                    for (const role of userRoles) {
                        const abilities = state.config.permissions?.[role] || [];
                        if (abilities.includes(req)) return true;
                        
                        // Optional: Wildcard support (e.g. "product.*")
                        if (abilities.some(a => a.endsWith('*') && req.startsWith(a.replace('*', '')))) return true;
                    }

                    return false;
                };

                // Logic Gate: AND vs OR
                if (matchAll) {
                    return requirements.every(req => checkSingle(req));
                } else {
                    return requirements.some(req => checkSingle(req));
                }
            }
        })
    }
);