import type { PropsWithChildren, ReactNode } from 'react';
import DefaultHeader from '../../components/page/header';
import DefaultFooter from '../../components/page/footer';

type PageLayoutProps = PropsWithChildren<{
    header?: ReactNode | false;   // false = hide header
    footer?: ReactNode | false;   // false = hide footer
}>;

export default function PageLayout({ children, header, footer }: PageLayoutProps) {
    return (
        <>
            {/* Header Logic */}
            {header === false ? null : header ?? <DefaultHeader />}

            <main>{children}</main>

            {/* Footer Logic */}
            {footer === false ? null : footer ?? <DefaultFooter />}
        </>
    );
}
