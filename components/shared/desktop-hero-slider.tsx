"use client";

import React, { FC, useEffect, useMemo } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Slide } from "@/types";

const repeatSlides = (slides: Slide[], count: number) => {
  const repeated: Slide[] = [];
  for (let i = 0; i < count; i++) {
    repeated.push(...slides);
  }
  return repeated.slice(0, count);
};

const MemoHeroSlider: FC<{ imagesSlide: Slide[] }> = ({ imagesSlide }) => {
  const slides: Slide[] = useMemo(() => [...imagesSlide], [imagesSlide]);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "dark") {
      setTheme("light");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Clone slides for infinite scroll
  const CLONE_COUNT = 100; // Number of slides to clone at each end
  const extendedSlides = useMemo(
    () => [
      ...repeatSlides(slides, CLONE_COUNT),
      ...slides,
      ...repeatSlides(slides, CLONE_COUNT),
    ],
    [slides, CLONE_COUNT]
  );

  return (
    <ScrollArea id="aaaa" className="w-full h-auto p-4 hidden sm:block">
      <div
        className="relative flex max-w-fit mx-auto flex-row gap-4 items-end justify-center overflow-x-auto scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {extendedSlides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              `rounded-2xl w-64 lg:max-w-[calc(16vw+0.5rem)] relative flex object-cover items-center justify-center transition-transform duration-500 ease-in-out`,
              slide.className
            )}
          >
            <Image
              src={slide.imageSrc}
              alt={`Slide ${index + 1}`}
              fill
              className="rounded-2xl object-cover"
            />
          </div>
        ))}
        <ScrollBar orientation="horizontal" className="opacity-0" />
      </div>
    </ScrollArea>
  );
};

export const HeroSliderDesktop = React.memo(MemoHeroSlider);
