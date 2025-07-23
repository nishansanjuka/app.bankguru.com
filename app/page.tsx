import { HeroSlider } from "@/components/shared/hero-slider-container";
import { Button } from "@/components/ui/button";
import React from "react";

export default function HomePage() {
  return (
    <>
      <div className=" relative max-w-screen h-screen sm:h-[90vh] bg-[#4B4B4B]">
        {/* heading and description       */}
        <div className=" max-w-[85vw] sm:max-w-[80vw] lg:max-w-[60vw] mx-auto text-center pt-[15vh] space-y-6">
          <h1 className=" text-2xl sm:text-5xl lg:text-6xl text-white font-extrabold text-center">
            Find the Best Credit Cards, Loans, and Accounts Instantly
          </h1>
          <p className=" text-sm sm:text-base lg:text-lg text-white font-raleway max-w-xl text-wrap mx-auto">
            Your money deserves better. Find the best options for your needs,
            powered by real-time data and unbiased analysis.
          </p>
          <Button size={'lg'} className="hover:cursor-pointer sm:text-lg rounded-none sm:w-52 sm:h-12 bg-orange-500 border-none text-white" variant={"outline"}>Get Started</Button>
        </div>

        {/* Background Image */}
        <div className="sm:absolute bottom-0 left-0 right-0 translate-y-0 sm:translate-y-24">
          <HeroSlider />
        </div>
      </div>
    </>
  );
}
