"use client";

import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { InviteUsersContainer } from "./invite-users-container";

export const Container: FC = () => {
  const [onOpenChange, setOnOpenChange] = useState(false);
  return (
    <div className="container mx-auto gap-2 flex flex-wrap items-start py-2">
      <div className="lg:flex-1">
        <h1 className="text-2xl font-bold">User Management & Invitations</h1>
        <p className="text-muted-foreground">
          Manage your organization’s users, view details, and invite new members
          to collaborate.
        </p>
      </div>
      <Button onClick={() => setOnOpenChange(true)} className="w-fit">
        Invite Member
      </Button>
      <ResponsiveDialog
        title="Invite Member"
        description="Invite new members to your organization by entering their email addresses."
        open={onOpenChange}
        onOpenChange={setOnOpenChange}
        className="w-full sm:w-[40vw] md:w-[90vw] lg:w-[60vw]"
      >
        <InviteUsersContainer onClose={() => setOnOpenChange(false)} />
      </ResponsiveDialog>
    </div>
  );
};
