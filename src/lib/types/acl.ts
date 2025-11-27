export type Role = string;
export type Permission = string;
export type Accessor = Role | Permission | string;

export interface ACLConfig {
    mode: 'local' | 'remote';
    /**
     * Group definitions.
     * Example: { "staff": ["admin", "manager"], "public": ["guest"] }
     */
    groups?: Record<string, Role[]>;
    
    /**
     * Permission definitions.
     * Example: { "manager": ["product.create", "product.edit"] }
     */
    permissions?: Record<Role, Permission[]>;

    /**
     * Optional fetcher for remote mode
     */
    fetchRemoteConfig?: () => Promise<{ groups?: Record<string, Role[]>, permissions?: Record<Role, Permission[]> }>;
}

export interface ACLState {
    config: ACLConfig;
    isReady: boolean;
}

export interface ACLActions {
    configure: (config: ACLConfig) => Promise<void>;
    check: (userRoles: Role[], accessor: Accessor | Accessor[], matchAll?: boolean) => boolean;
}