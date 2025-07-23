"use client";

import { imagesSlide } from "@/data/hero-images";
import { FC } from "react";
import { HeroSliderMobile } from "./mobile-hero-slider";
import { HeroSliderDesktop } from "./desktop-hero-slider";
import { useIsMobile } from "@/hooks/use-mobile";

export const HeroSlider: FC = () => {
  const isMobile = useIsMobile();
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
