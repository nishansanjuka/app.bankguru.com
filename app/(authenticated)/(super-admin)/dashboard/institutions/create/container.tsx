"use client";

import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { NewInstitutionContainer } from "./create-institutions-container";

export const Container: FC = () => {
  const [onOpenChange, setOnOpenChange] = useState(false);
  return (
    <div className="container mx-auto gap-2 flex flex-wrap items-start py-2">
      <div className="lg:flex-1">
        <h1 className="text-2xl ">Create new Institution</h1>
        <p className="text-muted-foreground max-w-[60vw]">
          Create a new institution type to manage different categories of
          institutions within your system. This will help in organizing and
          defining the roles and functionalities associated with each type of
          institution.
        </p>
      </div>
      <Button onClick={() => setOnOpenChange(true)} className="w-fit">
        New Institution
      </Button>
      <ResponsiveDialog
        title="Create Institution"
        description="Create a new institution by entering the necessary details."
        open={onOpenChange}
        onOpenChange={setOnOpenChange}
        className="w-fit"
      >
        <NewInstitutionContainer onClose={() => setOnOpenChange(false)} />
      </ResponsiveDialog>
    </div>
  );
};
