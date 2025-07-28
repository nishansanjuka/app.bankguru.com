import { LifeBuoy, Send, Users } from "lucide-react";

const sidebarData = {
  navMain: [
    {
      title: "User Management",
      url: "/dashboard/user-management",
      icon: Users,
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
