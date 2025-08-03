"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/utils";
import { ApiResponseData } from "@/types/api-response";
import { organizationSchema } from "@/types/organization";
import {
  createNewOrganization,
  updateOrganizationName,
} from "@/lib/actions/organizations";
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
import { AccountTypeCombobox } from "@/components/institution-types/account-type-combobox";

export const NewInstitutionContainer: FC<{
  id?: string;
  type?: "create" | "update";
  data?: Partial<z.infer<typeof organizationSchema>> & { typeId?: string };
  onClose: () => void;
}> = ({ id, type = "create", data, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<string>(data?.typeId || "");

  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: data?.name || "",
    },
  });

  const queryClient = getQueryClient();

  const onSubmit = async (values: z.infer<typeof organizationSchema>) => {
    if (!accountType) {
      toast.error("Please select an account type.");
      return;
    }
    try {
      let res: ApiResponseData<string> = { success: false, error: "" };
      setIsLoading(true);
      if (type === "update" && id) {
        res = await updateOrganizationName(id, values.name, accountType);
      } else if (type === "create") {
        res = await createNewOrganization(values.name, accountType);
      }

      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["organizations"],
          refetchType: "active",
          exact: false,
        });
        toast.success(
          `Institution ${
            type === "create" ? "created" : "updated"
          } successfully!`
        );
      } else {
        toast.error(res.error || "Failed to create/update institution.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create/update institution. Please try again."
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
        <AccountTypeCombobox
          value={accountType}
          onChange={setAccountType}
          className="w-full justify-between"
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormDescription>
                Enter a unique name for the institution. This will be used for
                identification.
              </FormDescription>
              <FormControl>
                <Input
                  className="w-full mt-2"
                  placeholder="Institution Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit" className="w-fit mt-4">
          {isLoading
            ? type === "update"
              ? "Updating..."
              : "Creating..."
            : type === "update"
            ? "Update Institution"
            : "Create Institution"}
        </Button>
      </form>
    </Form>
  );
};
