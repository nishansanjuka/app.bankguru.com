import { useEffect } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { getUserOrganizationWithAuth } from "../lib/actions/organizations";

export function useSetDefaultOrg() {
  const { organization, setActive } = useClerk();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    async function setDefaultOrg() {
      if (!organization && isSignedIn && isLoaded) {
        const res = await getUserOrganizationWithAuth();
        if (res.success) {
          setActive({ organization: res.data });
        }
      }
    }
    setDefaultOrg();
  }, [organization, setActive, isSignedIn, isLoaded]);
}
