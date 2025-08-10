import { NavBar } from "@/components/shared/nav-bar";
import React, { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <NavBar />
      <div className="translate-y-20 sticky top-16 ">{children}</div>
    </div>
  );
}
