"use client";

import {
  Folder,
  MoreHorizontal,
  Share,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavSlot2({
  slot2,
  dropdownItems,
  label = "Slot2",
  viewMoreButton = null,
}: {
  slot2?: {
    name: string;
    url: string;
    icon: LucideIcon | any;
  }[];
  dropdownItems?: {
    name: string;
    url: string;
    icon: LucideIcon | any;
  }[];
  label?: string;
  viewMoreButton?: React.ReactNode;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {slot2?.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                {typeof item.icon === 'function' ? <item.icon /> : <span>{item.icon}</span>}
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            {dropdownItems && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  {dropdownItems?.map((item) => (
                    <DropdownMenuItem key={item.name}>
                      {typeof item.icon === 'function' ? <item.icon /> : <span>{item.icon}</span>}
                      <span>{item.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        ))}
      
        {viewMoreButton}
      </SidebarMenu>
    </SidebarGroup>
  );
}
