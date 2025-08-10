"use client";

import { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { GuruBotProvider } from "./gurubot-provider";
import { getQueryClient } from "@/lib/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { useSetDefaultOrg } from "@/hooks/use-set-default-org";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = getQueryClient();
  useSetDefaultOrg();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GuruBotProvider>
            {children}
          </GuruBotProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};
