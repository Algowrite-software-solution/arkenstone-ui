"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  LogOut,
  LucideIcon,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSlot2 } from "@/components/sidebar/nav-slot2"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


interface AppData {
  name: string;
  textSlot1: string;
  url: string;
  icon: LucideIcon | any;
  logo?: string;
}

interface UserData {
  name: string;
  email: string;
  avatar: string;
  url: string;
  menuItems?: {
    name: string;
    url: string;
    icon: LucideIcon | any;
  }[];
}

interface NavMainData {
  title: string;
  url: string;
  icon: LucideIcon | any;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

interface NavSlot2Data {
  name: string;
  url: string;
  icon: LucideIcon | any;
}

interface NavSecondaryData {
  title: string;
  url: string;
  icon: LucideIcon | any;
}

interface NavbarProps {
  app: AppData;
  user: UserData;
  navMain: NavMainData[];
  navSecondary: NavSecondaryData[];
  slot2: NavSlot2Data[];
  logout?: {
    name: string;
    url: string;
    icon: LucideIcon | any;
  };
}

// default Data
const data: NavbarProps = {
  app: {
    name: "Example App",
    textSlot1: "Enterprise",
    url: "#",
    icon: Command,
  },
  user: {
    name: "Example User",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
    url: "#",
    menuItems: [
      {
        name: "Profile",
        url: "#",
        icon: User,
      },
      {
        name: "Settings",
        url: "#",
        icon: Settings2,
      },
      {
        name: "Logout",
        url: "#",
        icon: LogOut,
      },
    ],
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  slot2: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
      
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
  logout: { name: "Logout", url: "#", icon: LogOut }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {data.app.logo && <img src={data.app.logo} alt={data.app.name} />}
                  {data.app.icon && !data.app.logo && <data.app.icon className="size-4" />}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{data.app.name}</span>
                  <span className="truncate text-xs">{data.app.textSlot1}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSlot2 slot2={data.slot2} dropdownItems={data.slot2} label="Slot2" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} logout={data.logout} />
      </SidebarFooter>
    </Sidebar>
  )
}
