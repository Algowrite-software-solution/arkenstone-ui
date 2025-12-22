"use client";

import * as React from "react";
import data from "./mock-sidebar-data.json";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSlot2 } from "@/components/sidebar/nav-slot2";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface AppData {
  name?: string;
  textSlot1?: string;
  url: string;
  icon: React.ReactNode | any;
  logo?: string;
  sidebarComponent?: React.ReactNode;
}

export interface UserData {
  name: string;
  email: string;
  avatar: string;
  url: string;
  menuItems?: {
    name: string;
    url: string;
    icon: React.ReactNode | any;
  }[];
}

export interface NavMainData {
  title: string;
  url: string;
  icon: React.ReactNode | any;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface NavSlot2Data {
  name: string;
  url: string;
  icon: React.ReactNode | any;
}

export interface NavSecondaryData {
  title: string;
  url: string;
  icon: React.ReactNode | any;
}

export interface NavbarProps {
  app: AppData;
  user: UserData;
  navMain?: NavMainData[];
  navSecondary?: NavSecondaryData[];
  slot2?: NavSlot2Data[];
  logout?: {
    name: string;
    url: string;
    icon: React.ReactNode | any;
  };
}

export function AppSidebar({
  navbarProps = data,
  navbarUserComponent = null,
  ...props
}: { navbarProps?: NavbarProps; navbarUserComponent?: React.ReactNode } & React.ComponentProps<typeof Sidebar>) {
  const sidebarTitleExists = navbarProps.app.name && navbarProps.app.textSlot1;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              {navbarProps.app.sidebarComponent ?? (
                <a href="#">
                  <div
                    className={`${
                      !sidebarTitleExists ? "w-full" : ""
                    } text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent`}
                  >
                    {navbarProps.app.logo && (
                      <img
                        src={navbarProps.app.logo}
                        alt={navbarProps.app.name}
                        className="object-contain"
                      />
                    )}
                    {navbarProps.app.icon && !navbarProps.app.logo && (
                      <navbarProps.app.icon className="size-4" />
                    )}
                  </div>
                  {sidebarTitleExists && (
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {navbarProps.app.name}
                      </span>
                      <span className="truncate text-xs">
                        {navbarProps.app.textSlot1}
                      </span>
                    </div>
                  )}
                </a>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navbarProps.navMain && <NavMain items={navbarProps.navMain || []} />}

        {navbarProps.slot2 && (
          <NavSlot2
            slot2={navbarProps.slot2 || []}
            dropdownItems={navbarProps.slot2 || []}
            label="Slot2"
          />
        )}

        {navbarProps.navSecondary && (
          <NavSecondary
            items={navbarProps.navSecondary || []}
            className="mt-auto"
          />
        )}
      </SidebarContent>
      <SidebarFooter>
        {navbarUserComponent ?? <NavUser user={navbarProps.user} logout={navbarProps.logout} />}
      </SidebarFooter>
    </Sidebar>
  );
}
