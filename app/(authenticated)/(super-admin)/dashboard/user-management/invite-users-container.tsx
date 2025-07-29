"use client";

import { MultiInput } from "@/components/shared/multi-input";
import { Button } from "@/components/ui/button";
import { inviteOrganizationUsers } from "@/lib/actions/invitations";
import { getQueryClient } from "@/lib/utils";
import { isValidEmail } from "@/lib/utils/email-validator";
import { FC, useState } from "react";

export const InviteUsersContainer: FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendInvitations = async () => {
    const queryClient = getQueryClient();
    try {
      setIsLoading(true);
      const res = await inviteOrganizationUsers(emails);
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["invitations"],
          refetchType: "active",
          exact: false,
        });
      } else {
        throw new Error(res.error || "Failed to invite users");
      }
      setEmails([]);
    } catch (error) {
      console.error("Error inviting users:", error);
      throw new Error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      onClose();
      setEmails([]); // Clear emails after sending invitations
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4 items-end">
        <div className="w-full">
          <MultiInput
            items={emails}
            setItems={setEmails}
            label="Team Emails"
            validate={isValidEmail}
            maxItems={10}
          />
        </div>
        <Button onClick={handleSendInvitations} className="w-fit">
          {isLoading
            ? "Sending..."
            : `Send Invitation${emails.length > 1 ? "s" : ""}`}
        </Button>
      </div>
    </>
  );
};
