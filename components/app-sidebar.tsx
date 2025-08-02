"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import sidebarData from "@/data/sidebar-data";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { authenticatedRoutes } from "@/lib/actions/authenticated-routes";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: routesData } = useQuery({
    queryKey: ["authenticated-routes"],
    queryFn: async () => {
      const res = await authenticatedRoutes();
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
  });

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <Image
                  src={"/logo/bankguru-transparent.png"}
                  alt=""
                  width={986}
                  height={260}
                  className="w-[60%] object-contain group-data-[collapsible=icon]:hidden dark:hidden"
                />
                <Image
                  src={"/logo/bankguru-white.png"}
                  alt=""
                  width={986}
                  height={260}
                  className="w-[60%] object-contain group-data-[collapsible=icon]:hidden dark:group-data-[collapsible=icon]:hidden dark:block hidden"
                />
                <Image
                  src={"/logo/logo.png"}
                  alt=""
                  width={232}
                  height={262}
                  className="w-full size-8 object-contain group-data-[collapsible=icon]:block hidden"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={routesData || []} />
        <NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
