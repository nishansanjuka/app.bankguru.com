"use client";

import { FC, useEffect, useState } from "react";
import { LanguageChooser } from "./language-chooser";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navData } from "@/data/nav-data";
import Image from "next/image";

export const NavBar: FC = () => {
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
          "p-4 fixed w-full top-0 z-50",
          showColors ? " bg-opacity-80" : "backdrop-blur-2xl bg-stone-700/70 "
        )}
      >
        <div className="container mx-auto font-light">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-white hover:text-[#E27A24] transition-colors duration-300"
            >
              <Image
                src={"/logo/bankguru-white.png"}
                alt=""
                width={986}
                height={260}
                className="w-40 object-contain group-data-[collapsible=icon]:hidden"
              />
            </Link>
            <div className="space-x-10 hidden sm:flex truncate">
              {navData.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "hover:text-[#E27A24] transition-colors duration-300",
                    pathname === item.path ? "text-[#E27A24]" : "text-white/40"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <LanguageChooser />
          </div>
        </div>
      </nav>
    </>
  );
};
