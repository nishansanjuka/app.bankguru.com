import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Serif_Sinhala,
  Nunito,
  Raleway,
} from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/providers";
import { TopLoader } from "@/components/shared/top-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const sinhala = Noto_Serif_Sinhala({
  variable: "--font-sinhala",
  subsets: ["sinhala"],
});

export const metadata: Metadata = {
  title: {
    default: "BankGuru - Your Financial Services Companion",
    template: "%s | BankGuru",
    absolute: "BankGuru - Your Financial Services Companion",
  },
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
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signUpForceRedirectUrl={"/auth/callback"}
      signInForceRedirectUrl={"/auth/callback"}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} ${raleway.variable} ${sinhala.variable} antialiased font-nunito`}
        >
          <Providers>
            <TopLoader />
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
