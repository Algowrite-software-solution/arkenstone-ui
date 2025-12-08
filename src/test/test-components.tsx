import {DefaultPanelLayout} from "@/layouts/panels/default-panel-layout";
import { BreadcrumbItemType } from "@/components/custom/breadcrumb";
import { NavbarProps } from "@/components/sidebar/app-sidebar";
import { PersonStanding, Settings, Activity, MessageCircle, User, HelpCircle } from "lucide-react";

const navbarData: NavbarProps = {
  app: { name: "No Name", textSlot1: "Text Slot 1", logo: "/logo.png", icon: "/icon.png", url: "#" },
  user: { name: "User Name", email: "user@example.com", avatar: "/avatar.png", url: "#" },
  logout: { name: "Logout", url: "#", icon: "/logout-icon.png" },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: <PersonStanding className="h-4 w-4" />, isActive: true },
    { title: "Settingss", url: "/settings", icon: <Settings className="h-4 w-4" /> },
  ],
  navSecondary: [
    { title: "Activity", url: "/activity", icon: <Activity className="h-4 w-4" /> },
    { title: "Messages", url: "/messages", icon: <MessageCircle className="h-4 w-4" /> },
  ],
  slot2: [
    { name: "Profile", url: "/profile", icon: <User className="h-4 w-4" /> },
    { name: "Help", url: "/help", icon: <HelpCircle className="h-4 w-4" /> },
  ]
};

const breadcrumb: BreadcrumbItemType[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Level 1", href: "/level-1" },
  { title: "Level 2", href: "/level-2" },
  { title: "Level 3", href: "/level-3" },
];

export default function TestComponents() {
  return (
    <DefaultPanelLayout breadcrumbs={breadcrumb} navbarProps={navbarData}>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl">Comp 1</div>
        <div className="bg-muted/50 aspect-video rounded-xl">Component 2</div>
        <div className="bg-muted/50 aspect-video rounded-xl">Component 3</div>
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min">Main Content</div>
    </DefaultPanelLayout>
  );
}
