"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { productFormSchema, ProductFormValues } from "@/types/product-types";
import NestedCombobox from "@/components/shared/nested-combobox";
import { useState } from "react";
import DynamicFormFields, {
  DynamicFormField,
} from "@/components/shared/dynamic-form-fields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getProductCategoryHierarchy } from "@/lib/actions/products/hierarchy";
import ImageUpload from "@/components/shared/image-uploader";
import { createProduct } from "@/lib/actions/products";
import { toast } from "sonner";

export default function ProductCreateContainer() {
  const [fields, setFields] = useState<DynamicFormField[]>([]);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useQuery({
    queryKey: ["productCategoryHierarchy"],
    queryFn: async () => {
      const res = await getProductCategoryHierarchy();
      if (!res.success) {
        throw new Error(res.error);
      } else {
        return res.data;
      }
    },
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productTypeId: "",
      name: "",
      details: {
        description: "",
        terms: "",
        fees: "",
        eligibility: "",
        additionalInfo: {},
      },
      isFeatured: false,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsLoading(true);
      const res = await createProduct({
        productTypeId: data.productTypeId,
        details: {
          additionalInfo: [
            ...fields,
            ...(productImage
              ? [
                  {
                    id: "product-image",
                    label: "Product Image",
                    type: "image" as const,
                    value: productImage,
                    description: "",
                    title: "",
                  },
                ]
              : []),
          ],
          eligibility: data.details.eligibility || "",
          description: data.details.description || "",
          fees: data.details.fees || "",
          terms: data.details.terms || "",
        },
        name: data.name,
        isFeatured: data.isFeatured,
      });

      if (res.success) {
        toast.success("Product created successfully!");
      } else {
        toast.error("Failed to create product: " + res.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <Tabs defaultValue="new-product" className="mb-6 container mx-auto">
        <TabsList className="mb-4">
          <TabsTrigger value="new-product">New Product</TabsTrigger>
          <TabsTrigger value="dynamic-fields">Product list</TabsTrigger>
        </TabsList>
        <TabsContent value="new-product">
          <div className="">
            <div className="mb-14">
              <h1 className="text-3xl font-semibold">Create New Product</h1>
              <p>
                Use this form to create a new financial product. Fill in the
                basic information and any additional details as required.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-8 lg:gap-14">
                  {/* Basic Product Information */}
                  <div className="space-y-4 col-span-3">
                    <h2 className="text-2xl font-semibold text-muted-foreground">
                      General Information
                    </h2>

                    <FormField
                      control={form.control}
                      name="productTypeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Type</FormLabel>
                          <FormControl>
                            <NestedCombobox
                              data={{ data: data || [] }}
                              onChange={field.onChange}
                              value={field.value}
                            />
                          </FormControl>
                          <FormDescription>
                            Select the category and specific type for this
                            product.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Ran Kakulu Personal Loan"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The name of the financial product.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="details.description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Low-interest loan for personal use"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A brief description of the product.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <ImageUpload
                      value={productImage}
                      onChange={setProductImage}
                      label="Product Image"
                      description="Upload a high-quality product image for your listing."
                      buttonText="Upload Photo"
                      className="w-full flex flex-col pb-2"
                    />

                    <FormField
                      control={form.control}
                      name="details.terms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Terms</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Standard loan terms apply. See full terms and conditions."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Detailed terms and conditions for the product.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="details.fees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fees</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 5% p.a. processing fee"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Any applicable fees for the product.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="details.eligibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Eligibility</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 18+ years old, minimum income of $X"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Criteria for eligibility to apply for this product.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Mark as Featured</FormLabel>
                            <FormDescription>
                              If checked, this product will be highlighted as a
                              featured offering.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-fit mt-5">
                      {isLoading ? "Creating..." : "Create Product"}
                    </Button>
                  </div>

                  {/* Dynamic Additional Information */}
                  <div className="space-y-4 col-span-5">
                    <h2 className="text-2xl font-semibold text-muted-foreground">
                      Additional Product Details
                    </h2>
                    <FormDescription>
                      These fields are dynamically generated based on product
                      type or other configurations.
                    </FormDescription>

                    <DynamicFormFields fields={fields} setFields={setFields} />
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
