import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface BreadcrumbItemType {
  title: string;
  href: string;
}

export function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: BreadcrumbItemType[];
}) {
  if (breadcrumbs.length === 0) return null;

  const shouldCollapse = breadcrumbs.length >= 4;

  const first = breadcrumbs[0];
  const second = breadcrumbs[1] ?? null;
  const last = breadcrumbs[breadcrumbs.length - 1];
  const middle = breadcrumbs.slice(2, -2);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* First */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href={first.href}>{first.title}</a>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {shouldCollapse && second && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href={second.href}>{second.title}</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        <BreadcrumbSeparator />

        {/* Middle items */}
        {shouldCollapse ? (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                  •••
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {middle.map((item, i) => (
                    <DropdownMenuItem key={i}>
                      <a href={item.href}>{item.title}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
          </>
        ) : (
          <>
            {middle.map((item, index) => (
              <Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <a href={item.href}>{item.title}</a>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            ))}
          </>
        )}

        {/* Last */}
        <BreadcrumbItem>
          <BreadcrumbPage>{last.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
