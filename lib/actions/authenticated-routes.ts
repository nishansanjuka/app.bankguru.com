"use server";

import { NavMainItem } from "@/components/nav-main";
import sidebarData from "@/data/sidebar-data";
import { ApiResponse, ApiResponseData } from "@/types/api-response";
import { auth } from "@clerk/nextjs/server";

export const authenticatedRoutes = async (): Promise<
  ApiResponseData<NavMainItem[]>
> => {
  const { userId, has } = await auth();

  if (!userId) {
    return ApiResponse.failure("Unauthorized");
  }

  const routes = sidebarData.navMain.filter((item) => {
    // Check if the user has the required role for the route
    if (item.role) {
      return item.role.some((role) =>
        has({
          role,
        })
      );
    }
    // If no specific role is required, include the route
    return true;
  });
  return ApiResponse.success(routes);
};
