import { GuruBotHelpText } from "@/components/gurubot";
import { ChooserTabs } from "@/components/shared/chooser-tabs";
import { HeroSlider } from "@/components/shared/hero-slider-container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@clerk/nextjs/server";
import {
  CreditCard,
  HandCoins,
  HousePlus,
  TrendingUp,
  Shield,
  Users,
  Star,
  CheckCircle,
  Clock,
  Calculator,
  Award,
  BarChart3,
  Quote,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export const metadata = {
  title: "BankGuru - Home",
  description:
    "A financial services comparison and analytics platform to help you find the best banking solutions.",
  icons: {
    icon: "/logo/logo.png",
  },
  openGraph: {
    title: "BankGuru - Home",
    description:
      "A financial services comparison and analytics platform to help you find the best banking solutions.",
    url: "https://bankguru.com",
    siteName: "BankGuru",
    images: [
      {
        url: "/logo/bankguru-transparent.png",
        width: 1200,
        height: 630,
        alt: "BankGuru Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function HomePage() {
  const { userId, orgId } = await auth();

  return (
    <>
      <div className="space-y-20 flex flex-col pt-28 2xl:pt-14">
        <div className=" relative max-w-screen h-screen sm:h-[90vh] bg-[#4B4B4B]">
          {/* heading and description       */}
          <div className=" max-w-[85vw] sm:max-w-[80vw] lg:max-w-[60vw] mx-auto text-center pt-[15vh] space-y-6">
            <h1 className=" text-2xl xl:text-4xl 2xl:text-6xl text-white font-extrabold text-center">
              Find the Best Credit Cards, Loans, and Accounts Instantly
            </h1>
            <p className=" text-sm sm:text-base lg:text-lg text-white font-raleway max-w-xl text-wrap mx-auto">
              Your money deserves better. Find the best options for your needs,
              powered by real-time data and unbiased analysis.
            </p>
            <Link
              href={userId && orgId ? "/dashboard" : userId ? "/" : "/sign-up"}
            >
              <Button
                size={"lg"}
                className=" sm:text-lg rounded-none sm:w-52 sm:h-12 bg-orange-500 border-none text-white"
                variant={"outline"}
              >
                {userId && orgId ? "Go to Dashboard" : "Get Started"}
              </Button>
            </Link>
            <div className="mt-4"></div>
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
            <div className="aspect-square  rounded-lg flex flex-col items-center justify-center relative">
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
              <div className="mt-2">
                <GuruBotHelpText
                  text="What types of mortgages are available in Sri Lanka?"
                  className="text-xs"
                />
              </div>
            </div>
            <div className="aspect-square  rounded-lg flex flex-col items-center justify-center relative">
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
              <div className="mt-2">
                <GuruBotHelpText
                  text="Which credit card offers the best rewards in Sri Lanka?"
                  className="text-xs"
                />
              </div>
            </div>
            <div className="aspect-square  rounded-lg flex flex-col items-center justify-center relative">
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
              <div className="mt-2">
                <GuruBotHelpText
                  text="What are the requirements for a personal loan?"
                  className="text-xs"
                />
              </div>
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

        {/* Why Choose BankGuru Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-[85vw] sm:max-w-[80vw] lg:max-w-[60vw] mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Why 50,000+ Sri Lankans Trust BankGuru
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                We&apos;re more than just a comparison site - we&apos;re your
                financial decision partner
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center border-none shadow-lg">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-orange-500" />
                  </div>
                  <CardTitle className="text-xl">100% Unbiased</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    We don&apos;t take commissions from banks. Our
                    recommendations are based purely on data and your best
                    interests.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-none shadow-lg">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="w-8 h-8 text-orange-500" />
                  </div>
                  <CardTitle className="text-xl">Real-Time Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Our rates and terms are updated daily from official bank
                    sources. Always get the most current information.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-none shadow-lg">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-orange-500" />
                  </div>
                  <CardTitle className="text-xl">Expert Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Our financial experts and AI-powered GuruBot provide
                    personalized advice for your unique situation.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="py-16">
          <div className="max-w-[85vw] sm:max-w-[80vw] lg:max-w-[60vw] mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                BankGuru by the Numbers
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                See how we&apos;re helping Sri Lankans make better financial
                decisions every day
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">
                  50K+
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  Happy Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">
                  25+
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  Partner Banks
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">
                  LKR 5B+
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  Loans Facilitated
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">
                  4.9/5
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  User Rating
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Tools Section */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
          <div className="max-w-[85vw] sm:max-w-[80vw] lg:max-w-[60vw] mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Smart Financial Tools
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Make informed decisions with our suite of calculators and
                comparison tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Calculator className="w-8 h-8 text-orange-500" />
                    <CardTitle>EMI Calculator</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Calculate monthly payments for any loan amount, interest
                    rate, and tenure.
                  </CardDescription>
                  <Link href={"/calculators?type=loan-payment"}>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Calculate Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                    <CardTitle>Simple Interest Calculator</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Calculate simple interest for your investments and savings
                    quickly and easily.
                  </CardDescription>
                  <Link href={"/calculators?type=simple-interest"}>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Calculate Interest
                    </Button>
                  </Link>
                </CardContent>
              </Card>

                <Card className="group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-orange-500" />
                  <CardTitle>Compound Interest Calculator</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                  Calculate compound interest for investments and see how your money grows over time.
                  </CardDescription>
                  <Link href={"/calculators?type=compound-interest"}>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Calculate Growth
                  </Button>
                  </Link>
                </CardContent>
                </Card>
            </div>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="py-16">
          <div className="max-w-[85vw] sm:max-w-[80vw] lg:max-w-[60vw] mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                What Our Users Say
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Real stories from Sri Lankans who found their perfect financial
                products
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/users/2.jpg"
                      alt="Priya Mendis"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle className="text-base">Priya Mendis</CardTitle>
                      <CardDescription>
                        Software Engineer, Colombo
                      </CardDescription>
                    </div>
                  </div>
                  <Quote className="absolute top-4 right-4 w-6 h-6 text-orange-200" />
                </CardHeader>
                <CardContent>
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-orange-400 text-orange-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    &ldquo;BankGuru helped me find a mortgage with 0.5% lower
                    interest rate than what my bank initially offered. Saved me
                    over LKR 800,000!&rdquo;
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/users/1.jpg"
                      alt="Rohan Silva"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle className="text-base">Rohan Silva</CardTitle>
                      <CardDescription>Business Owner, Kandy</CardDescription>
                    </div>
                  </div>
                  <Quote className="absolute top-4 right-4 w-6 h-6 text-orange-200" />
                </CardHeader>
                <CardContent>
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-orange-400 text-orange-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    &ldquo;The credit card comparison tool is amazing. Found a
                    card with better rewards and no annual fee. GuruBot&apos;s
                    advice was spot on!&rdquo;
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/users/3.jpg"
                      alt="Anushka Perera"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle className="text-base">
                        Anushka Perera
                      </CardTitle>
                      <CardDescription>Teacher, Galle</CardDescription>
                    </div>
                  </div>
                  <Quote className="absolute top-4 right-4 w-6 h-6 text-orange-200" />
                </CardHeader>
                <CardContent>
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-orange-400 text-orange-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    &ldquo;As a first-time home buyer, BankGuru&apos;s guides
                    made the process so much easier. The step-by-step approach
                    was exactly what I needed.&rdquo;
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Latest Financial News & Insights */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-[85vw] sm:max-w-[80vw] lg:max-w-[60vw] mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Latest Financial Insights
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Stay updated with the latest trends, policy changes, and market
                insights
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-lg transition-all duration-300 p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src="/insights/1.jpg"
                    alt="Central Bank Policy Update"
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                    Breaking
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-orange-500 transition-colors">
                    Central Bank Cuts Rates by 50 Basis Points
                  </CardTitle>
                  <CardDescription>
                    Analysis of the latest monetary policy decision and its
                    impact on loans and deposits.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="size-4" />2 hours ago
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-500"
                    >
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src="/insights/2.jpg"
                    alt="Digital Banking Trends"
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-blue-500 text-white">
                    Trending
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-orange-500 transition-colors">
                    Digital Banking Revolution in Sri Lanka
                  </CardTitle>
                  <CardDescription>
                    How mobile banking and fintech are changing the way Sri
                    Lankans manage money.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="size-4" />1 day ago
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-500"
                    >
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all p-0 duration-300">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src="/insights/3.jpg"
                    alt="Investment Guide"
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                    Guide
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-orange-500 transition-colors">
                    Beginner&apos;s Guide to Stock Market Investing
                  </CardTitle>
                  <CardDescription>
                    Everything you need to know to start investing in the
                    Colombo Stock Exchange.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="size-4" />3 days ago
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-500"
                    >
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Partner Banks Section */}
        <div className="py-16">
          <div className="max-w-[85vw] sm:max-w-[80vw] lg:max-w-[60vw] mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Trusted by Leading Financial Institutions
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                We partner with Sri Lanka&apos;s top banks and financial
                institutions to bring you the best deals
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="flex justify-center">
                <Image
                  src="/bank-logos/combank.webp"
                  alt="Commercial Bank"
                  width={120}
                  height={60}
                  className="grayscale hover:grayscale-0 transition-all"
                />
              </div>
              <div className="flex justify-center">
                <Image
                  src="/bank-logos/hnb.png"
                  alt="HNB"
                  width={120}
                  height={60}
                  className="grayscale hover:grayscale-0 transition-all"
                />
              </div>
              <div className="flex justify-center">
                <Image
                  src="/bank-logos/amana.png"
                  alt="Amana Bank"
                  width={120}
                  height={60}
                  className="grayscale hover:grayscale-0 transition-all"
                />
              </div>
              <div className="flex justify-center">
                <Image
                  src="/bank-logos/boc.jpg"
                  alt="BOC"
                  width={120}
                  height={60}
                  className="grayscale hover:grayscale-0 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
          <div className="max-w-[85vw] sm:max-w-[80vw] lg:max-w-[60vw] mx-auto text-center">
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Ready to Find Your Perfect Financial Product?
              </h2>
              <p className="text-lg text-orange-100 max-w-2xl mx-auto">
                Join thousands of Sri Lankans who have found better rates, saved
                money, and made smarter financial decisions with BankGuru.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href={
                    userId && orgId ? "/dashboard" : userId ? "/" : "/sign-up"
                  }
                >
                  <Button
                    size="lg"
                    className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                  >
                    {userId && orgId ? "Go to Dashboard" : "Get Started Free"}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 text-lg font-semibold bg-orange-700"
                >
                  Learn More
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 text-orange-100 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  No hidden fees
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  100% free to use
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Instant results
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
