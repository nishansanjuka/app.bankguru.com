import { ChooserTabs } from "@/components/shared/chooser-tabs";
import { HeroSlider } from "@/components/shared/hero-slider-container";
import { Button } from "@/components/ui/button";
import { CreditCard, HandCoins, HousePlus } from "lucide-react";
import React from "react";

export default function HomePage() {
  return (
    <>
      <div className="space-y-20 flex flex-col">
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
            <Button
              size={"lg"}
              className=" sm:text-lg rounded-none sm:w-52 sm:h-12 bg-orange-500 border-none text-white"
              variant={"outline"}
            >
              Get Started
            </Button>
          </div>

          {/* Background Image */}
          <div className="sm:absolute bottom-0 left-0 right-0 translate-y-0 sm:translate-y-24">
            <HeroSlider />
          </div>
        </div>

        <div className="mt-20">
          <div className="max-w-[85vw] sm:max-w-[80vw] lg:max-w-[60vw] mx-auto text-center py-12 space-y-4">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Explore Personal Loans, Mortgages, and Credit Cards
            </h2>
            <p className="text-base sm:text-lg text-gray-700 font-raleway max-w-2xl mx-auto">
              Compare top offers for personal loans, mortgages, and credit
              cards. Find the right financial products tailored to your needs
              and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[85vw] sm:max-w-[50vw] mx-auto px-4">
            <div className="aspect-square  rounded-lg flex flex-col items-center justify-center">
              <div className="size-28 mb-4 rounded-full bg-muted flex items-center justify-center">
                <HousePlus
                  className="size-20 text-orange-500"
                  strokeWidth={1}
                />
              </div>
              <p className="text-foreground mt-4 font-bold">Mortgagues</p>
              <Button
                variant={"ghost"}
                className="text-orange-500 mt-5 hover:cursor-pointer font-semibold"
              >
                COMPARE NOW
              </Button>
            </div>
            <div className="aspect-square  rounded-lg flex flex-col items-center justify-center">
              <div className="size-28 mb-4 rounded-full bg-muted flex items-center justify-center">
                <CreditCard
                  className="size-20 text-orange-500"
                  strokeWidth={1}
                />
              </div>
              <p className="text-foreground mt-4 font-bold">Credit Cards</p>
              <Button
                variant={"ghost"}
                className="text-orange-500 mt-5 hover:cursor-pointer font-semibold"
              >
                COMPARE NOW
              </Button>
            </div>
            <div className="aspect-square  rounded-lg flex flex-col items-center justify-center">
              <div className="size-28 mb-4 rounded-full bg-muted flex items-center justify-center">
                <HandCoins
                  className="size-20 text-orange-500"
                  strokeWidth={1}
                />
              </div>
              <p className="text-foreground mt-4 font-bold">Personal Loans</p>
              <Button
                variant={"ghost"}
                className="text-orange-500 mt-5 hover:cursor-pointer font-semibold"
              >
                COMPARE NOW
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-[85vw] sm:max-w-[80vw] lg:max-w-[60vw] mx-auto text-center py-12 space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Helping Sri Lankans make smarter financial decisions
          </h1>
          <p className="text-base sm:text-lg text-gray-700 font-raleway max-w-2xl mx-auto">
            Empowering you to compare, choose, and save on credit cards, loans,
            and more tailored for Sri Lanka.
          </p>
        </div>

        <ChooserTabs />
      </div>
    </>
  );
}
