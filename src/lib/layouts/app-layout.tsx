import { Toaster } from '../components/ui/sonner';
import PageLayout from './page/page-layout';

import type { PropsWithChildren } from 'react';

export default function AppLayout({ children }: PropsWithChildren) {
    return (
        <PageLayout>
            {children}
            <Toaster />
        </PageLayout>
    );
}