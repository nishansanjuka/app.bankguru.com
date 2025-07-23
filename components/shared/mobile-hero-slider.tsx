import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Slide } from "@/types";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";

export function HeroSliderMobile({ slides }: { slides: Slide[] }) {
  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      className="w-full max-w-xs sm:hidden h-full mx-auto mt-10"
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="basis-[85%]">
            <div className="p-1">
              <Card className="p-0 border-none shadow-none rounded-xl bg-transparent">
                <CardContent className="flex rounded-xl relative p-0 aspect-square items-center justify-center ">
                  <Image
                    src={slide.imageSrc}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="rounded-xl object-cover  absolute inset-0"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
