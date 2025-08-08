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
import DynamicNavigation from "./dynamic-navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductCategoryHierarchy } from "@/lib/actions/products/hierarchy";
import { Menu, X } from "lucide-react";

export const NavBar: FC<{ className?: string }> = ({ className }) => {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [showColors, setShowColors] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["hierarchy"],
    queryFn: async () => {
      const res = await getProductCategoryHierarchy();
      if (!res.success) {
        throw new Error("Failed to fetch product categories");
      }
      return res.data;
    },
  });

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav
        className={cn(
          "fixed w-full top-0 z-50 transition-all duration-300 border-b",
          showColors
            ? "bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-sm"
            : "backdrop-blur-xl bg-white/90 border-gray-200/60 shadow-md",
          className
        )}
      >
        {/* Main Navigation */}
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 group transition-transform duration-300"
            >
              <Image
                src={"/logo/bankguru-transparent.png"}
                alt="BankGuru Logo"
                width={986}
                height={260}
                className="w-32 lg:w-40 h-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation - Combined navData and Categories */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 flex-1 justify-center">
              {/* Regular Navigation Items */}
              <div className="mx-auto items-center flex w-fit overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                {navData.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "relative px-3 xl:px-4 py-2 font-medium text-sm transition-all duration-300 rounded-lg group whitespace-nowrap",
                      "hover:bg-orange-50",
                      pathname === item.path
                        ? "text-orange-600 bg-orange-50 after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-orange-600 after:rounded-full"
                        : "text-gray-700 hover:text-orange-600"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              {/* Separator */}
              <div className="h-6 w-px bg-gray-200 mx-2 xl:mx-3" />
              {categories && <DynamicNavigation data={categories} />}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Language Chooser - Hidden on mobile */}
              <div className="hidden sm:block">
                <LanguageChooser />
              </div>

              {/* User Section */}
              {isSignedIn ? (
                <div className="flex items-center space-x-3">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-9 h-9 ring-2 ring-orange-100 hover:ring-orange-200 transition-all duration-200",
                        userButtonPopoverCard:
                          "border border-gray-200 shadow-lg",
                        userButtonPopoverActions: "text-gray-600",
                      },
                    }}
                  />
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 font-medium"
                  asChild
                >
                  <Link href={"/sign-in"}>Sign In</Link>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 hover:bg-orange-50 hover:text-orange-600"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg transition-all duration-300 z-40",
            isMobileMenuOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-2 invisible"
          )}
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {navData.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "block px-4 py-3 rounded-lg font-medium transition-all duration-200",
                    pathname === item.path
                      ? "text-orange-600 bg-orange-50 border-l-4 border-orange-600"
                      : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Categories - Using DynamicNavigation */}
            {categories && categories.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 px-4">
                  Categories
                </h3>
                <div className="px-2">
                  <DynamicNavigation data={categories} />
                </div>
              </div>
            )}

            {/* Mobile Language Chooser */}
            <div className="pt-3 border-t border-gray-100">
              <LanguageChooser />
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};
