"use client";

import { imagesSlide } from "@/data/hero-images";
import { FC, useEffect } from "react";
import { HeroSliderMobile } from "./mobile-hero-slider";
import { HeroSliderDesktop } from "./desktop-hero-slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";

export const HeroSlider: FC = () => {
  const isMobile = useIsMobile();

  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isMobile ? (
        <HeroSliderMobile slides={imagesSlide} />
      ) : (
        <HeroSliderDesktop imagesSlide={imagesSlide} />
      )}
    </>
  );
};
