import { Metadata } from "next";
import { FC, PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Access your BankGuru account.",
};
    
const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

export default Layout;
