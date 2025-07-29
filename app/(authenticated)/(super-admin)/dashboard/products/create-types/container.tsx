"use client";

import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { DefineProductTypeContainer } from "./create-product-types-container";

export const Container: FC = () => {
  const [onOpenChange, setOnOpenChange] = useState(false);
  return (
    <div className="container mx-auto gap-2 flex flex-wrap items-start py-2">
      <div className="lg:flex-1">
        <h1 className="text-2xl ">Define Product Types</h1>
        <p className="text-muted-foreground">
          Define the types of products that can be created in your system. This
          will help in categorizing and managing different product types
          effectively.
        </p>
      </div>
      <Button onClick={() => setOnOpenChange(true)} className="w-fit">
        New Product Type
      </Button>
      <ResponsiveDialog
        title="Create New Product Type"
        description="Define a new product type by providing the necessary details."
        open={onOpenChange}
        onOpenChange={setOnOpenChange}
        className="w-full sm:w-[40vw] md:w-[90vw] lg:w-[60vw]"
      >
        <DefineProductTypeContainer onClose={() => setOnOpenChange(false)} />
      </ResponsiveDialog>
    </div>
  );
};
