import { useEffect } from "react";
import { useACLStore } from "../stores/acl.store";

export function Arkenstone({ children }: { children: React.ReactNode }) {

    const { configure } = useACLStore();

    useEffect(() => {
        configure({
            mode: 'local',
            // ROLE GROUPS
            groups: {
                'staff': ['admin', 'manager', 'editor'],
                'financial_approvers': ['admin', 'cfo']
            },
            // CAPABILITIES
            permissions: {
                'admin': ['*'],
                'manager': ['product.create', 'product.edit', 'order.view'],
                'editor': ['product.edit'],
                'guest': ['product.view']
            }
        });
    }, []);

  return <>{children}</>;
}