import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar, NavbarProps } from "@/components/sidebar/app-sidebar";
import { ThemeProvider } from "@/provider/theme-provider";
import {
  BreadcrumbItemType,
  Breadcrumbs,
} from "@/components/custom/breadcrumb";

export function DefaultPanelLayout({
  children,
  breadcrumbs,
  navbarProps,
  navbarUserComponent = null,
}: {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItemType[];
  navbarProps?: NavbarProps;
  navbarUserComponent?: React.ReactNode;
}) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar
          navbarProps={navbarProps}
          navbarUserComponent={navbarUserComponent}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />

              <Breadcrumbs breadcrumbs={breadcrumbs || []} />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
