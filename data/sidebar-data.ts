import { NavMainItem } from "@/components/nav-main";
import { NavSecondaryItem } from "@/components/nav-secondary";
import { LifeBuoy, Send } from "lucide-react";

const sidebarData: {
  navMain: NavMainItem[];
  navSecondary: NavSecondaryItem[];
} = {
  navMain: [
    {
      title: "User Management",
      url: "/dashboard/user-management",
      icon: "Users",
    },
    {
      title: "Institutions",
      url: "/dashboard/institutions/create",
      role: ["org:super_admin", "org:super_standard"],
      icon: "Landmark",
      items: [
        {
          title: "Define Institutions",
          url: "/dashboard/institutions/create",
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
};

export default sidebarData;
