"use client";
import { useClerk, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { handleUserPromote, validateCallbackForInstitutes } from "./actions";
import {
  getPrivateMetadataWithAuth,
  updatePrivateMetadataWithAuth,
} from "@/lib/actions/meta-data";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { getUserOrganizationWithAuth } from "@/lib/actions/organizations";
import { toast } from "sonner";

export const Container: FC = () => {
  const { user } = useUser();

  const { setActive } = useClerk();

  const setActiveOrganization = async () => {
    const res = await getUserOrganizationWithAuth();
    if (res.success) {
      setActive({ organization: res.data.id });
    } else {
      toast.error(
        res.error || "Failed to fetch organization. Please try again later."
      );
    }
  };

  const router = useRouter();

  const { isPending, isLoading } = useQuery({
    queryKey: ["userType", user?.id ?? ""],
    queryFn: async () => {
      const metaRes = await getPrivateMetadataWithAuth("userType");
      const userType = localStorage.getItem("userType");
      localStorage.removeItem("userType");
      const instituteName =
        localStorage.getItem("instituteName") || "Financial Institute";
      localStorage.removeItem("instituteName");
      if (!metaRes.success) {
        throw new Error(metaRes.error);
      }

      if (metaRes.data === "institute" || userType === "institute") {
        const validateRes = await validateCallbackForInstitutes();
        if (!validateRes.success) {
          const accountCategory = localStorage.getItem("accountType");
          await updatePrivateMetadataWithAuth({
            userType: "institute",
            accountCategory,
          });
          localStorage.removeItem("accountType");
          const promoteRes = await handleUserPromote(
            instituteName,
            accountCategory!
          );
          if (promoteRes.success) {
          } else {
            throw new Error(promoteRes.error);
          }
        }
      } else if (metaRes.data === "user") {
      } else {
        await updatePrivateMetadataWithAuth("userType", "user");
      }
      await setActiveOrganization();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/");
      return "DONE";
    },
    staleTime: 0,
    enabled: !!user,
  });

  return <>{(isLoading || isPending) && <Loading />}</>;
};
