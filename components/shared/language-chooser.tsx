"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import Image from "next/image";
import { Globe } from "lucide-react";

export function LanguageChooser() {
  const languages = [
    {
      code: "en",
      label: "English",
      icon: "/globe.svg", // Use globe for English
    },
    // {
    //   code: "si",
    //   label: "සිංහල",
    //   icon: "/file.svg", // Use a different icon or flag for Sinhala
    // },
    // {
    //   code: "ta",
    //   label: "தமிழ்",
    //   icon: "/window.svg", // Use a different icon or flag for Tamil
    // },
  ];

  const [selected, setSelected] = useState(languages[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-[#E27A24]">
          <Globe width={20} height={20} />
          <span>{selected.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="start">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe width={18} height={18} className="text-[#E27A24]" />
          <span style={{ color: "#E27A24", fontWeight: 600 }}>Language</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setSelected(lang)}
              className={
                selected.code === lang.code ? "font-semibold text-white" : ""
              }
              style={
                selected.code === lang.code
                  ? { backgroundColor: "#E27A24" }
                  : undefined
              }
            >
              <Image
                src={lang.icon}
                alt={lang.label}
                width={18}
                height={18}
                className="mr-2"
              />
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
