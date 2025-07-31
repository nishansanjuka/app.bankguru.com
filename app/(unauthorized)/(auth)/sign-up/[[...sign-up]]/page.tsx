"use client";

import type React from "react";
import { SignUp as ClerkSignUp } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Building2,
  User,
  ArrowRight,
  ChevronLeft,
  Shield,
  CheckCircle,
  Building,
  Component,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AccountTypeCombobox } from "@/components/institution-types/account-type-combobox";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<
    "user-type" | "institution-name" | "signup"
  >("user-type");
  const [userType, setUserType] = useState<"user" | "institute" | null>(null);
  const [instituteName, setInstituteName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountType, setAccountType] = useState<string>("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const isTicket = searchParams.get("__clerk_ticket");

    if (isTicket) {
      setCurrentStep("signup");
      setUserType("institute");
    }
  }, [searchParams]);

  useEffect(() => {
    // Check if user type is already stored
    const storedUserType = localStorage.getItem("userType");
    const storedInstituteName = localStorage.getItem("instituteName");
    const storedAccountType = localStorage.getItem("accountType");

    if (storedUserType === "user") {
      setUserType(storedUserType);
      setCurrentStep("signup");
    } else if (storedUserType === "institute" && storedInstituteName) {
      setUserType(storedUserType);
      setInstituteName(storedInstituteName);
      setAccountType(storedAccountType || "");
      setCurrentStep("signup");
    }
  }, []);

  const handleUserTypeSelection = (type: "user" | "institute") => {
    setUserType(type);
    localStorage.setItem("userType", type);

    if (type === "user") {
      setCurrentStep("signup");
    } else {
      setCurrentStep("institution-name");
    }
  };

  const handleInstitutionNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instituteName.trim() || !accountType) return;

    setIsSubmitting(true);

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      localStorage.setItem("instituteName", instituteName.trim());
      localStorage.setItem("accountType", accountType);
      setCurrentStep("signup");
      setIsSubmitting(false);
    }, 800);
  };

  const goBackFromInstitutionName = () => {
    setCurrentStep("user-type");
    setUserType(null);
    setInstituteName("");
    setAccountType("");
    localStorage.removeItem("userType");
    localStorage.removeItem("instituteName");
    localStorage.removeItem("accountType");
  };

  if (currentStep === "user-type") {
    return (
      <div className="min-h-screen py-[10vh] bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-16">
            <Image
              src={"/logo/logo.png"}
              alt=""
              width={232}
              height={262}
              className="w-full size-20 object-contain mb-8"
            />
            <h1 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Welcome to{" "}
              <span className="font-semibold text-orange-500">BankGuru</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The comprehensive platform for comparing and analyzing financial
              services across banks, mortgage companies, and financial
              institutions
            </p>
          </div>

          {/* Selection Cards */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-800 text-center mb-12">
              Choose your account type to get started
            </h2>

            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Individual User Card */}
              <button
                onClick={() => handleUserTypeSelection("user")}
                className="group relative p-12 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 transition-all duration-500 rounded-3xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-orange-200 text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                      <User className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-2 transition-all duration-300" />
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Individual User
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Perfect for personal banking needs, loan comparisons, and
                    finding the best financial products for your individual
                    requirements.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                      <span>Personal loan comparisons</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                      <span>Mortgage rate analysis</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                      <span>Banking service reviews</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Financial Institution Card */}
              <button
                onClick={() => handleUserTypeSelection("institute")}
                className="group relative p-12 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 transition-all duration-500 rounded-3xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-orange-200 text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                      <Building2 className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-2 transition-all duration-300" />
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Financial Institution
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Designed for banks, credit unions, mortgage companies, and
                    financial institutions looking to showcase their services
                    and reach new customers.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                      <span>Service portfolio management</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                      <span>Competitive rate positioning</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                      <span>Customer acquisition tools</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-6">
              Trusted by leading financial institutions
            </p>
            <div className="grid grid-cols-4 max-w-sm sm:max-w-lg items-center justify-center gap-8 mx-auto">
              <Image
                src={"/bank-logos/amana.png"}
                alt=""
                width={200}
                height={60}
              />
              <Image
                src={"/bank-logos/boc.jpg"}
                alt=""
                width={200}
                height={60}
              />
              <Image
                src={"/bank-logos/combank.webp"}
                alt=""
                width={200}
                className=""
                height={60}
              />
              <Image
                src={"/bank-logos/hnb.png"}
                alt=""
                width={200}
                height={60}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "institution-name") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Branding & Info */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-6">
              <Image
                src={"/logo/logo.png"}
                alt="BankGuru Logo"
                width={80}
                height={80}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-4xl font-light text-gray-900 mb-4">
                  Tell us about your{" "}
                  <span className="font-semibold text-orange-500">
                    Institution
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Help us personalize your experience by providing your
                  institution&apos;s name and account type. This will help us
                  tailor our services to your specific needs.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Building className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Personalized Dashboard
                  </h3>
                  <p className="text-gray-600">
                    Get a customized dashboard with insights relevant to your
                    institution type and size.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Secure & Private
                  </h3>
                  <p className="text-gray-600">
                    Your institution information is encrypted and used only to
                    enhance your platform experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Better Matching
                  </h3>
                  <p className="text-gray-600">
                    Connect with relevant partners and opportunities in your
                    financial sector.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <div className="space-y-8">
              {/* Back Button */}
              <button
                onClick={goBackFromInstitutionName}
                className="flex items-center text-orange-600 hover:text-orange-700 transition-colors group"
              >
                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to account type
              </button>

              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-light text-gray-900">
                      Institution Details
                    </h1>
                    <p className="text-gray-600">
                      Please provide your institution&apos;s name and account
                      type
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={handleInstitutionNameSubmit}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label className="text-gray-800 font-medium text-base flex items-center">
                    <Building className="w-4 h-4 mr-2 text-orange-500" />
                    Institution Name
                  </Label>
                  <Input
                    type="text"
                    value={instituteName}
                    onChange={(e) => setInstituteName(e.target.value)}
                    placeholder="e.g., First National Bank, ABC Credit Union"
                    required
                    className="h-14 rounded-2xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-orange-500 text-base transition-all duration-300"
                  />
                  <p className="text-sm text-gray-500 ml-6">
                    Enter the official name of your financial institution
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-800 font-medium text-base flex items-center">
                    <Component className="size-4 text-orange-500" />
                    Account Caregory
                  </Label>
                  <AccountTypeCombobox
                    value={accountType}
                    onChange={setAccountType}
                  />
                  <p className="text-sm text-gray-500 ml-6">
                    Select the type of your institution
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={
                    !instituteName.trim() || !accountType || isSubmitting
                  }
                  className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base rounded-2xl transition-all duration-300 hover:scale-[1.02] focus:ring-4 focus:ring-orange-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Account Creation
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Security Note */}
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-orange-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Secure & Confidential
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Your institution information is encrypted and will only be
                  used to personalize your BankGuru experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <Image
              src={"/logo/logo.png"}
              alt="BankGuru Logo"
              width={80}
              height={80}
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-4">
                Join{" "}
                <span className="font-semibold text-orange-500">BankGuru</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {userType === "user"
                  ? "Start your journey to smarter financial decisions with personalized comparisons and insights."
                  : `Welcome ${instituteName}! Connect with customers and showcase your financial services on our trusted platform.`}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Bank-Level Security
                </h3>
                <p className="text-gray-600">
                  Your data is protected with enterprise-grade encryption and
                  security measures.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Verified Information
                </h3>
                <p className="text-gray-600">
                  All financial data is verified and updated in real-time from
                  trusted sources.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Trusted Network
                </h3>
                <p className="text-gray-600">
                  Join thousands of users and hundreds of financial
                  institutions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full flex flex-col-reverse gap-6 items-center py-4 justify-center">
          <Button
            onClick={goBackFromInstitutionName}
            variant={"link"}
            className="flex cursor-pointer items-center text-orange-600 hover:text-orange-700 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to account type
          </Button>
          <ClerkSignUp
            appearance={{
              elements: {
                header: "hidden",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
