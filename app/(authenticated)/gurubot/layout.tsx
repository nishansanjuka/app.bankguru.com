import { NavBar } from "@/components/shared/nav-bar";
import React, { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <NavBar />
      <div className=" translate-y-16 sm:translate-y-28 sticky sm:top-32 ">
        {children}
      </div>
    </div>
  );
}
