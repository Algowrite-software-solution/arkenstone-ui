import { useEffect } from "react";
import { useACLStore } from "../stores/acl.store";
import { ACLConfig } from "@/types/acl";


/**
 * Arkenstone Configuration for the application
 * 
 * This interface is used to configure the Arkenstone core features and functions
 * You need to pass this configuration to the Arkenstone component to initialize the Arkenstone core features
 */
interface ArkenstoneConfig {
   aclConfig: ACLConfig;
}


/**
 * Arkenstone Core Initiator component
 * 
 * This component is used to initialize the Arkenstone core features and functions
 * You need to wrap your application with this component to use Arkenstone features
 * you are able to pass a configuration to this component to initialize the Arkenstone core features
 * if nor passed the default configuration will be used
 * @param param0 
 * @returns 
 */
export function Arkenstone({ children , config }: { children: React.ReactNode , config?: ArkenstoneConfig }) {

    const { configure } = useACLStore();

    useEffect(() => {
        configure(config?.aclConfig ?? {
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