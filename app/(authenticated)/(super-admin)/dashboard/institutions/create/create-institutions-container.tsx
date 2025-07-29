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
import { defineInstitute } from "@/lib/actions/institutions/define-intitue";
import { getQueryClient } from "@/lib/utils";
import { institutionFormSchema } from "@/types/institution";

export const DefineInstitutionsContainer: FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof institutionFormSchema>>({
    resolver: zodResolver(institutionFormSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });

  const queryClient = getQueryClient();

  const onSubmit = async (values: z.infer<typeof institutionFormSchema>) => {
    try {
      setIsLoading(true);
      const res = await defineInstitute(values);

      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["institutions"],
          refetchType: "active",
          exact: false,
        });
        toast.success("Institution created successfully!");
      } else {
        toast.error(res.error || "Failed to create institution.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create institution. Please try again."
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
            name="code"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Institution Code</FormLabel>
                <FormDescription>
                  Enter a unique code for the institution. This will be used for
                  identification.
                </FormDescription>
                <FormControl>
                  <Input
                    className="w-full mt-2"
                    placeholder="BANK"
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
                  Enter a unique name for the institution. This will be used for
                  identification.
                </FormDescription>
                <FormControl>
                  <Input
                    className="w-full mt-2"
                    placeholder="Bank"
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
                  Enter a description for the institution.
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
          {isLoading ? "Creating..." : "Create Institution"}
        </Button>
      </form>
    </Form>
  );
};
