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

const sampleData = {
  data: [
    {
      id: "b91794a5-8cfd-4ec9-9870-c1a780ee92d8",
      parentId: null,
      name: "Loan",
      slug: "loan",
      description: "TESTTESTTEST",
      level: 0,
      children: [
        {
          id: "c4a23254-55b6-41b8-b18a-12eb9e7663cd",
          parentId: "b91794a5-8cfd-4ec9-9870-c1a780ee92d8",
          name: "House loan",
          slug: "house-loan",
          description: "House loan description",
          level: 1,
          productTypes: [
            {
              id: "41efb3f5-2c97-4bf9-a52f-4f531666b534",
              categoryId: "c4a23254-55b6-41b8-b18a-12eb9e7663cd",
              code: "HOUSE_LOAN",
              name: "House loan",
              description: "House loan description",
            },
          ],
        },
        {
          id: "d5b34567-66c7-4de8-c19b-23fc0f8774de",
          parentId: "b91794a5-8cfd-4ec9-9870-c1a780ee92d8",
          name: "Car loan",
          slug: "car-loan",
          description: "Car loan description",
          level: 1,
          productTypes: [
            {
              id: "52fgc4g6-3d08-5cf0-b63g-5g642777c645",
              categoryId: "d5b34567-66c7-4de8-c19b-23fc0f8774de",
              code: "CAR_LOAN",
              name: "Car loan",
              description: "Car loan description",
            },
          ],
        },
      ],
      productTypes: [
        {
          id: "0c2b6353-ad99-4cc3-b21c-ec082d5e16ff",
          categoryId: "b91794a5-8cfd-4ec9-9870-c1a780ee92d8",
          code: "LOAN",
          name: "Loan",
          description: "TESTTESTTEST",
        },
      ],
    },
    {
      id: "e6c45678-77d8-5ef9-d20c-34gd1g9885ef",
      parentId: null,
      name: "Insurance",
      slug: "insurance",
      description: "Insurance products",
      level: 0,
      children: [
        {
          id: "f7d56789-88e9-6fg0-e31d-45he2h0996fg",
          parentId: "e6c45678-77d8-5ef9-d20c-34gd1g9885ef",
          name: "Health Insurance",
          slug: "health-insurance",
          description: "Health insurance products",
          level: 1,
          productTypes: [
            {
              id: "63hgd5h7-4e19-6dg1-c74h-6h753888d756",
              categoryId: "f7d56789-88e9-6fg0-e31d-45he2h0996fg",
              code: "HEALTH_INS",
              name: "Health Insurance",
              description: "Health insurance products",
            },
          ],
        },
      ],
      productTypes: [
        {
          id: "74ihd6i8-5f20-7eh2-d85i-7i864999e867",
          categoryId: "e6c45678-77d8-5ef9-d20c-34gd1g9885ef",
          code: "INSURANCE",
          name: "Insurance",
          description: "Insurance products",
        },
      ],
    },
  ],
};

export default function Container() {
  const [fields, setFields] = useState<DynamicFormField[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      institutionId: "",
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

  const onSubmit = (data: ProductFormValues) => {
    console.log(data);
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
                <div className="grid grid-cols-1 lg:grid-cols-6 lg:gap-14">
                  {/* Basic Product Information */}
                  <div className="space-y-4 col-span-4">
                    <h2 className="text-2xl font-semibold text-muted-foreground">
                      General Information
                    </h2>
                    <FormField
                      control={form.control}
                      name="institutionId"
                      render={({ field }) => (
                        <FormItem className="sr-only">
                          <FormLabel>Institution ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., org_30axcfQdIdhoSMV7VGi3WqC89jR"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The unique identifier for the institution.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productTypeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Type</FormLabel>
                          <FormControl>
                            <NestedCombobox
                              data={sampleData}
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
                  </div>

                  {/* Dynamic Additional Information */}
                  <div className="space-y-4 col-span-2">
                    <h2 className="text-2xl font-semibold text-muted-foreground">
                      Additional Product Details
                    </h2>
                    <FormDescription>
                      These fields are dynamically generated based on product
                      type or other configurations.
                    </FormDescription>
                    <DynamicFormFields fields={fields} setFields={setFields} />
                    <Button type="submit" className="w-fit float-right">
                      Create Product
                    </Button>
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
