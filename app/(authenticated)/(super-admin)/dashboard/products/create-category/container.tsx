"use client";

import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { DefineCategoriesContainer } from "./create-product-category-container";

export const Container: FC = () => {
  const [onOpenChange, setOnOpenChange] = useState(false);
  return (
    <div className="container mx-auto gap-2 flex flex-wrap items-start py-2">
      <div className="lg:flex-1">
        <h1 className="text-2xl ">Define Categories</h1>
        <p className="text-muted-foreground">
          Define the types of categories that can be created in your system.
          This will help in categorizing and managing different categories
          effectively.
        </p>
      </div>
      <Button onClick={() => setOnOpenChange(true)} className="w-fit">
        New Category
      </Button>
      <ResponsiveDialog
        title="Create New Category"
        description="Define a new category by providing the necessary details."
        open={onOpenChange}
        onOpenChange={setOnOpenChange}
        className="w-full sm:w-[40vw] md:w-[90vw] lg:w-[60vw]"
      >
        <DefineCategoriesContainer onClose={() => setOnOpenChange(false)} />
      </ResponsiveDialog>
    </div>
  );
};
