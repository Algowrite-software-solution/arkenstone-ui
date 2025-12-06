import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  LucideIcon,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AvatarFallbackLetter } from "@/util/text-filter";

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    url?: string;
    menuItems?: {
      name: string;
      url: string;
      icon: LucideIcon | any;
    }[];
  };
  logout?: {
    name: string;
    url: string;
    icon: LucideIcon | any;
  };
}

export function NavUser({ user, logout }: NavUserProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar
                className="h-8 w-8 rounded-lg cursor-pointer"
                onClick={() => user.url && window.open(user.url, "_blank")}
              >
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {AvatarFallbackLetter(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar
                  className="h-8 w-8 rounded-lg cursor-pointer"
                  onClick={() => user.url && window.open(user.url, "_blank")}
                >
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {AvatarFallbackLetter(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {user.menuItems?.length ? <DropdownMenuSeparator /> : null}

            {user.menuItems?.length ? (
              <DropdownMenuGroup>
                {user.menuItems?.map((item) => (
                  <DropdownMenuItem key={item.name} className="cursor-pointer">
                    {item.icon && (typeof item.icon === 'function' ? <item.icon /> : <span>{item.icon}</span>)}
                    <span>{item.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            ) : null}

            <DropdownMenuSeparator />

            {logout && (
              <DropdownMenuItem>
                {logout.icon && (typeof logout.icon === 'function' ? <logout.icon /> : <span>{logout.icon}</span>)}
                {!logout.icon && <LogOut />}
                <span>{logout.name || "Log out"}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
