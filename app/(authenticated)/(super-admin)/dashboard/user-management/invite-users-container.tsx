"use client";

import { MultiInput } from "@/components/shared/multi-input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { inviteOrganizationUsers } from "@/lib/actions/invitations";
import { getQueryClient } from "@/lib/utils";
import { isValidEmail } from "@/lib/utils/email-validator";
import { Info } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";

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
        toast.success(
          `Invitation${emails.length > 1 ? "s" : ""} sent successfully!`
        );
      } else {
        toast.error(
          res.error || "Failed to send invitations. Please try again."
        );
      }
      setEmails([]);
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast.error(
        "An error occurred while sending invitations. Please try again."
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
        {emails.length === 0 && (
          <Alert className="bg-green-100 text-xs border-green-500 text-green-800">
            <Info />
            <AlertTitle>press enter to add email, max 10 emails</AlertTitle>
          </Alert>
        )}
        <Button
          disabled={isLoading || emails.length === 0}
          onClick={handleSendInvitations}
          className="w-fit"
        >
          {isLoading
            ? "Sending..."
            : `Send Invitation${emails.length > 1 ? "s" : ""}`}
        </Button>
      </div>
    </>
  );
};
