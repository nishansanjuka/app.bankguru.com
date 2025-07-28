"use client";
import { useClerk } from "@clerk/nextjs";
import { FC } from "react";

export const Container: FC = () => {
  const { organization } = useClerk();

  return <>{organization?.name}</>;
};
