import { FC, PropsWithChildren } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Separator } from "./ui/separator";
import { BreadcrumbContainer } from "./bread-crumb-container";
import { UserButton } from "@clerk/nextjs";
import { ModeToggleButton } from "./theme-toggler";
import { authenticatedRoutes } from "@/lib/actions/authenticated-routes";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/utils";

export const Sidebar: FC<PropsWithChildren> = async ({ children }) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
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
    <>
      <SidebarProvider>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <AppSidebar />
        </HydrationBoundary>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" disabled />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <div className="flex-1">
                <BreadcrumbContainer />
              </div>
              <ModeToggleButton variant={"ghost"} className="rounded-full" />
              <UserButton />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};
