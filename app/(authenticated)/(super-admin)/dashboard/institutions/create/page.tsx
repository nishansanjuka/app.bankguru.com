import React from "react";
import { Container } from "./container";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/utils";
import { getInstitutesTypes } from "@/lib/actions/institutions/define-intitue";
import InstitutionsContainerContainer from "@/components/institutions/container";

export default function DefineInstitutionPage() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["institutions"],
    queryFn: async () => {
      const res = await getInstitutesTypes();
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch institutions");
      }
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex-1 items-start gap-4 p-2 sm:px-6 sm:py-0 w-full ">
        <div className="mt-5 mb-2">
          <Container />
        </div>
        
        <div className="w-full mt-10 container mx-auto">
          <InstitutionsContainerContainer />
        </div>
      </main>
    </HydrationBoundary>
  );
}
