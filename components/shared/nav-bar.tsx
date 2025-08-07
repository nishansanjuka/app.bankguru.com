"use client";

import { FC, useEffect, useState } from "react";
import { LanguageChooser } from "./language-chooser";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navData } from "@/data/nav-data";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";

export const NavBar: FC<{ className?: string }> = ({ className }) => {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [showColors, setShowColors] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;

      if (scrollTop > 10) {
        setShowColors(false);
      } else {
        setShowColors(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Call once to set initial state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={cn(
          "p-4 fixed w-full top-0 z-50 transition-all duration-300",
          showColors
            ? "bg-white/95 backdrop-blur-sm border-b border-gray-200/50 "
            : "backdrop-blur-xl bg-white/90 border-b border-gray-200/60 ",
          className
        )}
      >
        <div className="container mx-auto font-light">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 hover:text-[#E27A24] transition-colors duration-300"
            >
              <Image
                src={"/logo/bankguru-transparent.png"}
                alt="BankGuru Logo"
                width={986}
                height={260}
                className="w-40 object-contain group-data-[collapsible=icon]:hidden"
              />
            </Link>
            <div className="space-x-8 hidden sm:flex truncate">
              {navData.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "font-medium transition-all duration-300 relative py-2 hover:scale-105",
                    pathname === item.path
                      ? "text-[#E27A24] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#E27A24] after:rounded-full"
                      : "text-gray-600 hover:text-[#E27A24] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-[#E27A24]/50 hover:after:rounded-full"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <LanguageChooser />
              {isSignedIn ? (
                <div className="flex items-center space-x-3">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                        userButtonPopoverCard: "border border-gray-200",
                        userButtonPopoverActions: "text-gray-600",
                      },
                    }}
                  />
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-[#E27A24] hover:text-white hover:border-[#E27A24] transition-all duration-300"
                >
                  <Link href={"/sign-in"}>Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
