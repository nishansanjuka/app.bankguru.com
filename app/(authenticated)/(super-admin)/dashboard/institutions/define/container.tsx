"use client";

import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { DefineInstitutionsContainer } from "./create-institutions-container";

export const Container: FC = () => {
  const [onOpenChange, setOnOpenChange] = useState(false);
  return (
    <div className="container mx-auto gap-2 flex flex-wrap items-start py-2">
      <div className="lg:flex-1">
        <h1 className="text-2xl ">Define Institution Types</h1>
        <p className="text-muted-foreground">
          Define the types of institutions that can be created in your system.
          This will help in categorizing and managing different institutions
          effectively.
        </p>
      </div>
      <Button onClick={() => setOnOpenChange(true)} className="w-fit">
        New Type
      </Button>
      <ResponsiveDialog
        title="Invite Member"
        description="Invite new members to your organization by entering their email addresses."
        open={onOpenChange}
        onOpenChange={setOnOpenChange}
        className="w-full sm:w-[40vw] md:w-[90vw] lg:w-[60vw]"
      >
        <DefineInstitutionsContainer onClose={() => setOnOpenChange(false)} />
      </ResponsiveDialog>
    </div>
  );
};
