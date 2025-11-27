import { cn } from '../../util/utils';
import { useIsMobile } from '../../hooks/use-mobile';
import { Menu } from 'lucide-react';
import React, { PropsWithChildren, createContext, useState } from 'react';
import PageSidebar from './sidebar';
import AppLogo from '../app-logo';
import { Link } from '@inertiajs/react';

type PageHeaderContextType = {
    isOpen: boolean;
    items?: HeaderItemProps[];
    setIsOpen: (isOpen: boolean) => void;
};

export const PageHeaderContext = createContext<PageHeaderContextType>({ isOpen: false, setIsOpen: () => {} });


const items: HeaderItemProps[] = [
    {
        name: 'Home',
        href: '/home',
    },
    {
        name: 'Booking',
        href: '/booking',
    },
    {
        name: 'Travel Tips',
        href: '/travel-tips',
    },
    {
        name: 'About',
        href: '/about',
    },
    {
        name: 'Contact',
        href: '/contact',
    }
];

// Header component
export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useIsMobile();

    return (
        <PageHeaderContext.Provider value={{ isOpen, items, setIsOpen }}>
            <header className="bg-background/5 backdrop-blur-xl flex w-full flex-col absolute z-50">
                <PageSidebar />
                <div className="container mx-auto flex w-full items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-1">
                        {isMobile && <button onClick={() => setIsOpen(!isOpen)}>{!isOpen && <Menu className="cursor-pointer" />}</button>}
                        <Header.Logo classNameIcon='h-16 w-16 aspect-square '  />
                    </div>
                    <div className="flex items-center gap-1">
                        {!isMobile && <Header.Nav>{items?.map((item) => <Header.Item key={item.name} {...item} />)}</Header.Nav>}
                    </div>
                </div>
            </header>
        </PageHeaderContext.Provider>
    );
}

// Item interface
export interface HeaderItemProps {
    name: string;
    icon?: React.ReactNode;
    href: string;
    className?: string;
}

// Header Item component
Header.Item = function HeaderItem({ name, icon, href, className }: HeaderItemProps) {
    return (
        <Link href={href} className={cn('hover:text-foreground font-bold text-foreground text-xl flex items-center gap-2 hover:underline', className)}>
            {icon}
            {name}
        </Link>
    );
};

// Nav component for grouping items
Header.Nav = function HeaderNav({
    children,
    orientation = 'horizontal',
    className,
}: PropsWithChildren<{ orientation?: 'horizontal' | 'vertical'; className?: string }>) {
    return <nav className={cn('flex gap-12 px-2', orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col', className)}>{children}</nav>;
};

// Logo component
Header.Logo = function HeaderLogo({ classNameIcon, classNameText }: { classNameIcon?: string; classNameText?: string }) {
    const isMobile = useIsMobile();
    return (
        <Link href="/">
            <AppLogo
                icon={
                    <img
                        src="/arkenstone-logo.png"
                        alt="App Logo"
                        className="h-full w-full object-contain"
                    />
                }
                name={isMobile ? 'Arkenstone' : 'Arkenstone Travel'}
                classNameIcon={classNameIcon}
                classNameText={classNameText}
            />
        </Link>
    );
};

export default Header;
