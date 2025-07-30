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
import { productTypeFormSchema } from "@/types/product-type";

import { ProductCategoryCombobox } from "@/components/categories/product-category-combobox";
import {
  defineProductType,
  updateProductType,
} from "@/lib/actions/products/types";
import { ApiResponseData } from "@/types/api-response";

export const DefineProductTypeContainer: FC<{
  id?: string;
  type?: "create" | "update";
  data?: Partial<z.infer<typeof productTypeFormSchema>>;
  onClose: () => void;
}> = ({ data, id, type = "create", onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof productTypeFormSchema>>({
    resolver: zodResolver(productTypeFormSchema),
    defaultValues: {
      categoryId: data?.categoryId || "",
      code: data?.code || "",
      name: data?.name || "",
      description: data?.description || "",
    },
  });

  const queryClient = getQueryClient();

  const onSubmit = async (values: z.infer<typeof productTypeFormSchema>) => {
    try {
      let res: ApiResponseData<string> = { success: false, error: "" };

      setIsLoading(true);

      if (type === "update" && id) {
        res = await updateProductType(id, values);
      } else {
        res = await defineProductType(values);
      }

      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["product-types"],
          refetchType: "active",
          exact: false,
        });
        toast.success("Product type created successfully!");
      } else {
        toast.error(res.error || "Failed to create product type.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create product type. Please try again."
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
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Product Category</FormLabel>
                <FormDescription>
                  Select the category this product type belongs to.
                </FormDescription>
                <FormControl>
                  <ProductCategoryCombobox
                    type={type}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            disabled={type === "update"}
            name="code"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Product Type Code</FormLabel>
                <FormDescription>
                  Enter a unique code for the product type. This will be used
                  for identification.
                </FormDescription>
                <FormControl>
                  <Input
                    className="w-full mt-2"
                    placeholder="PERSONAL_LOAN"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormDescription>
                  Enter a unique name for the product type. This will be used
                  for identification.
                </FormDescription>
                <FormControl>
                  <Input
                    className="w-full mt-2"
                    placeholder="Personal Loan"
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
                  Provide a brief description of the product type. This helps in
                  understanding the purpose of the product type.
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
            ? type === "create"
              ? "Creating..."
              : "Updating..."
            : type === "create"
            ? "Create Product Type"
            : "Update Product Type"}
        </Button>
      </form>
    </Form>
  );
};
