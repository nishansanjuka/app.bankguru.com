import { GuruBot } from "@/components/gurubot";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <GuruBot />
      {children}
    </>
  );
};

export default Layout;
