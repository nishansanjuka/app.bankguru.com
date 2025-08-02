import { Metadata } from "next";
import { FC, PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account to access BankGuru's features.",
};

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

export default Layout;
