import { GuruBot } from "@/components/gurubot";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <GuruBot />
      <div className="pt-14">{children}</div>
    </>
  );
};

export default Layout;
