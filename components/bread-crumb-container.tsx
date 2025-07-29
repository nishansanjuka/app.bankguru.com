"use client";

import React, { FC } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const BreadcrumbContainer: FC = () => {
  const pathName = usePathname();

  // Split path and filter out empty segments
  const segments = pathName.split("/").filter(Boolean);

  // Build breadcrumb items
  const breadcrumbItems = segments.map((segment, idx) => {
    // Build href for each segment
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const isLast = idx === segments.length - 1;
    const key = segments.slice(0, idx + 1).join("/");

    return (
      <React.Fragment key={key}>
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage className="capitalize">
              {decodeURIComponent(segment.replace(/-/g, " "))}
            </BreadcrumbPage>
          ) : (
            <Link href={href} className="capitalize">
              {decodeURIComponent(segment.replace(/-/g, " "))}
            </Link>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </React.Fragment>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/">Home</Link>
        </BreadcrumbItem>
        {segments.length > 0 && <BreadcrumbSeparator />}
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
