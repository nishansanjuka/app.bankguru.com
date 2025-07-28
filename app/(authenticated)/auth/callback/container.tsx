"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { handleUserPromote, validateCallbackForInstitutes } from "./actions";
import {
  getPrivateMetadataWithAuth,
  updatePrivateMetadataWithAuth,
} from "@/lib/actions/meta-data";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

export const Container: FC = () => {
  const { user } = useUser();

  const router = useRouter();

  const { isPending, isLoading } = useQuery({
    queryKey: ["userType", user?.id ?? ""],
    queryFn: async () => {
      const metaRes = await getPrivateMetadataWithAuth("userType");
      const userType = localStorage.getItem("userType");
      const instituteName =
        localStorage.getItem("instituteName") || "Financial Institute";

      if (!metaRes.success) {
        throw new Error(metaRes.error);
      }

      if (metaRes.data === "institute" || userType === "institute") {
        const validateRes = await validateCallbackForInstitutes();
        if (!validateRes.success) {
          await updatePrivateMetadataWithAuth("userType", "institute");
          const promoteRes = await handleUserPromote(instituteName);
          if (promoteRes.success) {
          } else {
            throw new Error(promoteRes.error);
          }
        }
      } else if (metaRes.data === "user") {
      } else {
        await updatePrivateMetadataWithAuth("userType", "user");
      }
      router.push("/dashboard");
      return "DONE";
    },
    staleTime: 0,
    enabled: !!user,
  });

  return (
    <>
      {(isLoading || isPending) && (
        <Loading isActualLoading={false} text="Redirecting....." />
      )}
    </>
  );
};
