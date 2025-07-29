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
      role: ["org:super_admin"],
      icon: "Users",
    },
    {
      title: "Institutions",
      url: "/dashboard/institutions/create",
      role: ["org:super_admin", "org:super_standard"],
      icon: "Landmark",
      isActive: true,
      items: [
        {
          title: "Define Institution Types",
          url: "/dashboard/institutions/create",
        },
      ],
    },
    {
      title: "Product Categories",
      url: "/dashboard/products/create-category",
      role: ["org:super_admin", "org:super_standard"],
      icon: "Tag",
      isActive: true,
      items: [
        {
          title: "Define Product Categories",
          url: "/dashboard/products/create-category",
        },
        {
          title: "Define Product Types",
          url: "/dashboard/products/create-types",
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
