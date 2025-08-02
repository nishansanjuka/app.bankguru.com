import type { Metadata } from "next";
import { NavBar } from "@/components/shared/nav-bar";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "BankGuru",
  description:
    "A financial services comparison and analytics platform to help you find the best banking solutions.",
  icons: {
    icon: "/logo/logo.png", // Path to your logo file
  },
  openGraph: {
    title: "BankGuru",
    description:
      "A financial services comparison and analytics platform to help you find the best banking solutions.",
    url: "https://bankguru.com", // Replace with your actual URL
    siteName: "BankGuru",
    images: [
      {
        url: "/public/logo/bankguru-transparent.png", // Path to your Open Graph image
        width: 1200,
        height: 630,
        alt: "BankGuru Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <NavBar />
      {children}
    </Fragment>
  );
}
