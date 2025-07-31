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
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/actions/products";
import { toast } from "sonner";
import ProductsContainer from "@/components/products/container";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils/cn";
import { getQueryClient } from "@/lib/utils";
import { Loader2, Trash2 } from "lucide-react";

export default function ProductCreateContainer({
  data,
  id,
  onClose,
  onlyProduct = false,
  type,
}: {
  type?: "create" | "update";
  id?: string;
  data?: Partial<Product>;
  onlyProduct?: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      {onlyProduct ? (
        <NewProductForm data={data} id={id} onClose={onClose} type={type} />
      ) : (
        <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
          <Tabs defaultValue="new-product" className="mb-6 container mx-auto">
            <TabsList className="mb-4">
              <TabsTrigger value="new-product">New Product</TabsTrigger>
              <TabsTrigger value="product-list">Product list</TabsTrigger>
            </TabsList>
            <TabsContent value="new-product">
              <NewProductForm
                data={data}
                id={id}
                onClose={onClose}
                type={type}
              />
            </TabsContent>
            <TabsContent value="product-list">
              <ProductsContainer />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}

const NewProductForm = ({
  data,
  id,
  onClose,
  type = "create",
}: {
  type?: "create" | "update";
  id?: string;
  data?: Partial<Product>;
  onClose?: () => void;
}) => {
  const [fields, setFields] = useState<DynamicFormField[]>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data?.details?.additionalInfo as any) || []
  );

  const [productImage, setProductImage] = useState<string | null>(() => {
    const value = data?.details?.additionalInfo.find(
      (field: DynamicFormField) => field.id === "product-image"
    )?.value;
    return typeof value === "string"
      ? value
      : value != null
      ? String(value)
      : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = getQueryClient();

  const { data: categories } = useQuery({
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
      details: {
        description: data?.details?.description || "",
        terms: data?.details?.terms || "",
        fees: data?.details?.fees || "",
        eligibility: data?.details?.eligibility || "",
        additionalInfo: fields,
      },
      isFeatured: data?.isFeatured || false,
      name: data?.name || "",
      productTypeId: data?.productTypeId || "",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsLoading(true);

      if (type === "update" && id) {
        // Check if "product-image" already exists in fields and update its value, otherwise add it
        const updatedFields = [...fields];
        const imageIndex = updatedFields.findIndex(
          (f) => f.id === "product-image"
        );
        if (productImage) {
          const imageField = {
            id: "product-image",
            label: "Product Image",
            type: "image" as const,
            value: productImage,
            description: "",
            title: "",
          };
          if (imageIndex !== -1) {
            updatedFields[imageIndex] = imageField;
          } else {
            updatedFields.push(imageField);
          }
        } else if (imageIndex !== -1) {
          // If no image, remove the field if it exists
          updatedFields.splice(imageIndex, 1);
        }

        const res = await updateProduct(id, {
          productTypeId: data.productTypeId,
          details: {
            additionalInfo: updatedFields,
            eligibility: data.details.eligibility || "",
            description: data.details.description || "",
            fees: data.details.fees || "",
            terms: data.details.terms || "",
          },
          name: data.name,
          isFeatured: data.isFeatured,
        });

        if (!res.success) {
          toast.error("Failed to update product: " + res.error);
        } else {
          toast.success("Product updated successfully!");
        }
      } else if (type === "create") {
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
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setIsLoading(false);
      onClose?.();
      form.reset();
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteProduct(id || "");
      if (!res.success) {
        toast.error(res.error || "Failed to delete category");
        return;
      }
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      onClose?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="p-2">
        <div className={cn(type === "update" ? "" : "mb-14")}>
          <h1 className="text-2xl font-semibold">
            {type === "create" ? "Create New Product" : ""}
          </h1>
          <p className="text-muted-foreground">
            {type === "create"
              ? `           Use this form to create a new financial product. Fill in the basic
            information and any additional details as required.`
              : ``}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-8 lg:gap-14">
              {/* Basic Product Information */}
              <div className="space-y-4 col-span-3">
                <h2 className="text-2xl font-semibold text-muted-foreground">
                  General Information
                </h2>

                <div className="space-y-4 lg:sticky lg:top-[-80%]">
                  <FormField
                    control={form.control}
                    name="productTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Type</FormLabel>
                        <FormControl>
                          <NestedCombobox
                            data={{ data: categories || [] }}
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

                  <div className="items-center mt-5 hidden lg:flex gap-2">
                    <Button type="submit" className="flex-1">
                      {isLoading
                        ? type === "update"
                          ? "Updating..."
                          : "Creating..."
                        : type === "update"
                        ? "Update Product"
                        : "Create Product"}
                    </Button>
                    <Button
                      disabled={isDeleting}
                      onClick={handleDelete}
                      variant={"destructive"}
                      size={"icon"}
                    >
                      {isDeleting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Dynamic Additional Information */}
              <div className="space-y-4 col-span-5">
                <h2 className="text-2xl font-semibold text-muted-foreground">
                  Additional Product Details
                </h2>
                <FormDescription>
                  These fields are dynamically generated based on product type
                  or other configurations.
                </FormDescription>

                <DynamicFormFields fields={fields} setFields={setFields} />
              </div>

              <div className="flex items-center gap-2 mt-5 lg:hidden">
                <Button
                  disabled={isDeleting}
                  onClick={handleDelete}
                  type="submit"
                  className="flex-1"
                >
                  {isLoading
                    ? type === "update"
                      ? "Updating..."
                      : "Creating..."
                    : type === "update"
                    ? "Update Product"
                    : "Create Product"}
                </Button>
                <Button variant={"destructive"} size={"icon"}>
                  {isDeleting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
