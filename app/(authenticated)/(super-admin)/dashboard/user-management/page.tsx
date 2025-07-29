import React from "react";
import { Container } from "./container";
import { getQueryClient } from "@/lib/utils";
import { getOrganizationMembers } from "@/lib/actions/organizations";
import { getOrganizationInvitations } from "@/lib/actions/invitations";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvitationsContainer from "@/components/members/pending-invitations/container";
import MembersContainer from "@/components/members/active-members/container";

export const metadata = {
  title: "User Management",
  description: "Manage users and invitations in your organization.",
};

export default async function UserManagementPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["members", 1, 10],
      queryFn: async () => await getOrganizationMembers(1, 10),
    }),
    queryClient.prefetchQuery({
      queryKey: ["invitations", 1, 10, undefined, "pending"],
      queryFn: () =>
        getOrganizationInvitations(1, 10, "pending", undefined, ["org:emp"]),
    }),
  ]);

  return (
    <main className="flex-1 items-start gap-4 p-2 sm:px-6 sm:py-0 w-full ">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="mt-5 mb-2">
          <Container />
        </div>
        <div className=" container mx-auto">
          <Tabs defaultValue="active">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="active">
              <div className="mt-6">
                <MembersContainer />
              </div>
            </TabsContent>
            <TabsContent value="pending">
              <div className="mt-6">
                <InvitationsContainer status="pending" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </HydrationBoundary>
    </main>
  );
}
