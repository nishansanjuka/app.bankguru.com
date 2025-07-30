"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FC, useState } from "react";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/utils";
import { productCategoryFormSchema } from "@/types/product-category";
import {
  defineCategory,
  updateCategory,
} from "@/lib/actions/products/categories";
import { ApiResponseData } from "@/types/api-response";

export const DefineCategoriesContainer: FC<{
  type?: "create" | "update";
  id?: string;
  data?: Partial<z.infer<typeof productCategoryFormSchema>>;
  onClose: () => void;
}> = ({ id, type = "create", data, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof productCategoryFormSchema>>({
    resolver: zodResolver(productCategoryFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
    },
  });

  const queryClient = getQueryClient();

  const onSubmit = async (
    values: z.infer<typeof productCategoryFormSchema>
  ) => {
    try {
      let res: ApiResponseData<string> = { success: false, error: "" };

      setIsLoading(true);
      if (type === "update" && id) {
        res = await updateCategory(id, {
          name: values.name,
          description: values.description,
        });
      } else if (type === "create") {
        res = await defineCategory(values);
      }

      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["categories"],
          refetchType: "active",
          exact: false,
        });
        toast.success("Category created successfully!");
      } else {
        toast.error(res.error || "Failed to create category.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create category. Please try again."
      );
    } finally {
      form.reset();
      onClose();
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4 items-end mt-5"
      >
        <div className="w-full flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormDescription>
                  Enter a unique name for the category. This will be used for
                  identification.
                </FormDescription>
                <FormControl>
                  <Input
                    className="w-full mt-2"
                    placeholder="Loan"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormDescription>
                  Provide a brief description of the category. This helps in
                  understanding the purpose of the category.
                </FormDescription>
                <FormControl>
                  <Textarea
                    className="w-full mt-2 h-full"
                    placeholder="Description"
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isLoading} type="submit" className="w-fit mt-4">
          {isLoading
            ? type === "update"
              ? "Updating..."
              : "Creating..."
            : type === "update"
            ? "Update Category"
            : "Create Category"}
        </Button>
      </form>
    </Form>
  );
};
