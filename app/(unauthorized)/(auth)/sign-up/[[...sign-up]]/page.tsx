"use client"

import type React from "react"

import * as Clerk from "@clerk/elements/common"
import * as SignUp from "@clerk/elements/sign-up"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  Loader2,
  Building2,
  User,
  ArrowRight,
  ChevronLeft,
  Mail,
  Lock,
  UserCheck,
  Shield,
  CheckCircle,
  Building,
} from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Icons } from "@/data/icons"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<"user-type" | "institution-name" | "signup">("user-type")
  const [userType, setUserType] = useState<"user" | "institute" | null>(null)
  const [instituteName, setInstituteName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if user type is already stored
    const storedUserType = localStorage.getItem("userType")
    const storedInstituteName = localStorage.getItem("instituteName")

    if (storedUserType === "user") {
      setUserType(storedUserType)
      setCurrentStep("signup")
    } else if (storedUserType === "institute" && storedInstituteName) {
      setUserType(storedUserType)
      setInstituteName(storedInstituteName)
      setCurrentStep("signup")
    }
  }, [])

  const handleUserTypeSelection = (type: "user" | "institute") => {
    setUserType(type)
    localStorage.setItem("userType", type)

    if (type === "user") {
      setCurrentStep("signup")
    } else {
      setCurrentStep("institution-name")
    }
  }

  const handleInstitutionNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!instituteName.trim()) return

    setIsSubmitting(true)

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      localStorage.setItem("instituteName", instituteName.trim())
      setCurrentStep("signup")
      setIsSubmitting(false)
    }, 800)
  }

  const goBackFromInstitutionName = () => {
    setCurrentStep("user-type")
    setUserType(null)
    setInstituteName("")
    localStorage.removeItem("userType")
    localStorage.removeItem("instituteName")
  }

  const goBackFromSignup = () => {
    if (userType === "institute") {
      setCurrentStep("institution-name")
    } else {
      setCurrentStep("user-type")
      setUserType(null)
      localStorage.removeItem("userType")
    }
  }

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
              Welcome to <span className="font-semibold text-orange-500">BankGuru</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The comprehensive platform for comparing and analyzing financial services across banks, mortgage
              companies, and financial institutions
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

                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Individual User</h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Perfect for personal banking needs, loan comparisons, and finding the best financial products for
                    your individual requirements.
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

                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Financial Institution</h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Designed for banks, credit unions, mortgage companies, and financial institutions looking to
                    showcase their services and reach new customers.
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
            <p className="text-sm text-gray-500 mb-6">Trusted by leading financial institutions</p>
            <div className="grid grid-cols-4 max-w-sm sm:max-w-lg items-center justify-center gap-8 mx-auto">
              <Image src={"/bank-logos/amana.png"} alt="" width={200} height={60} />
              <Image src={"/bank-logos/boc.jpg"} alt="" width={200} height={60} />
              <Image src={"/bank-logos/combank.webp"} alt="" width={200} className="" height={60} />
              <Image src={"/bank-logos/hnb.png"} alt="" width={200} height={60} />
            </div>
          </div>
        </div>
      </div>
    )
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
                  Tell us about your <span className="font-semibold text-orange-500">Institution</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Help us personalize your experience by providing your institution&apos;s name. This will help us tailor our
                  services to your specific needs.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Building className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personalized Dashboard</h3>
                  <p className="text-gray-600">
                    Get a customized dashboard with insights relevant to your institution type and size.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
                  <p className="text-gray-600">
                    Your institution information is encrypted and used only to enhance your platform experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Better Matching</h3>
                  <p className="text-gray-600">
                    Connect with relevant partners and opportunities in your financial sector.
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
                    <h1 className="text-3xl font-light text-gray-900">Institution Details</h1>
                    <p className="text-gray-600">Please provide your institution&apos;s name</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleInstitutionNameSubmit} className="space-y-6">
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
                  <p className="text-sm text-gray-500 ml-6">Enter the official name of your financial institution</p>
                </div>

                <Button
                  type="submit"
                  disabled={!instituteName.trim() || isSubmitting}
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
                  <span className="text-sm font-medium text-gray-700">Secure & Confidential</span>
                </div>
                <p className="text-sm text-gray-600">
                  Your institution information is encrypted and will only be used to personalize your BankGuru
                  experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
                Join <span className="font-semibold text-orange-500">BankGuru</span>
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
                <h3 className="font-semibold text-gray-900 mb-2">Bank-Level Security</h3>
                <p className="text-gray-600">
                  Your data is protected with enterprise-grade encryption and security measures.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Verified Information</h3>
                <p className="text-gray-600">
                  All financial data is verified and updated in real-time from trusted sources.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Trusted Network</h3>
                <p className="text-gray-600">Join thousands of users and hundreds of financial institutions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-lg mx-auto lg:mx-0">
          <SignUp.Root>
            <Clerk.Loading>
              {(isGlobalLoading) =>
                isGlobalLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    <SignUp.Step name="start">
                      <div className="space-y-8">
                        {/* Back Button */}
                        <button
                          onClick={goBackFromSignup}
                          className="flex items-center text-orange-600 hover:text-orange-700 transition-colors group"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                          {userType === "institute" ? "Back to institution details" : "Back to account type"}
                        </button>

                        {/* Header */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                              {userType === "user" ? (
                                <User className="w-7 h-7 text-white" />
                              ) : (
                                <Building2 className="w-7 h-7 text-white" />
                              )}
                            </div>
                            <div>
                              <h1 className="text-3xl font-light text-gray-900">Create Account</h1>
                              <p className="text-gray-600">
                                {userType === "user"
                                  ? "Individual User Account"
                                  : `Financial Institution Account${instituteName ? ` for ${instituteName}` : ""}`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Social Login */}
                        <div className="space-y-4">
                          <Clerk.Connection name="google" asChild>
                            <Button
                              size="lg"
                              variant="outline"
                              type="button"
                              disabled={isGlobalLoading}
                              className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-2xl transition-all duration-300 hover:scale-[1.02] focus:ring-4 focus:ring-orange-200"
                            >
                              <Clerk.Loading scope="provider:google">
                                {(isLoading) =>
                                  isLoading ? (
                                    <Loader2 className="size-5 animate-spin" />
                                  ) : (
                                    <>
                                      <Icons.google className="mr-3 size-5" />
                                      Continue with Google
                                    </>
                                  )
                                }
                              </Clerk.Loading>
                            </Button>
                          </Clerk.Connection>

                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-6 bg-white text-gray-500 font-medium">or continue with email</span>
                            </div>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                          <Clerk.Field name="emailAddress" className="space-y-3">
                            <Clerk.Label asChild>
                              <Label className="text-gray-800 font-medium text-base flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-orange-500" />
                                Email Address
                              </Label>
                            </Clerk.Label>
                            <Clerk.Input type="email" placeholder="you@example.com" required asChild>
                              <Input className="h-14 rounded-2xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-orange-500 text-base transition-all duration-300" />
                            </Clerk.Input>
                            <Clerk.FieldError className="block text-sm text-red-500 ml-6" />
                          </Clerk.Field>

                          <Clerk.Field name="password" className="space-y-3">
                            <Clerk.Label asChild>
                              <Label className="text-gray-800 font-medium text-base flex items-center">
                                <Lock className="w-4 h-4 mr-2 text-orange-500" />
                                Password
                              </Label>
                            </Clerk.Label>
                            <Clerk.Input placeholder="**********" type="password" required asChild>
                              <Input className="h-14 rounded-2xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-orange-500 text-base transition-all duration-300" />
                            </Clerk.Input>
                            <Clerk.FieldError className="block text-sm text-red-500 ml-6" />
                          </Clerk.Field>
                        </div>

                        {/* Submit */}
                        <div className="space-y-6">
                          <SignUp.Captcha className="empty:hidden" />
                          <SignUp.Action submit asChild>
                            <Button
                              disabled={isGlobalLoading}
                              className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base rounded-2xl transition-all duration-300 hover:scale-[1.02] focus:ring-4 focus:ring-orange-200"
                            >
                              <Clerk.Loading>
                                {(isLoading) => {
                                  return isLoading ? <Loader2 className="size-5 animate-spin" /> : "Create Account"
                                }}
                              </Clerk.Loading>
                            </Button>
                          </SignUp.Action>

                          <div className="text-center">
                            <Clerk.Link
                              navigate="sign-in"
                              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                            >
                              Already have an account? Sign in
                            </Clerk.Link>
                          </div>
                        </div>
                      </div>
                    </SignUp.Step>

                    <SignUp.Step name="continue">
                      <div className="space-y-8">
                        {/* Header */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                              <UserCheck className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h1 className="text-3xl font-light text-gray-900">Complete Profile</h1>
                              <p className="text-gray-600">Just one more step to get started</p>
                            </div>
                          </div>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                          <Clerk.Field name="username" className="space-y-3">
                            <Clerk.Label>
                              <Label className="text-gray-800 font-medium text-base flex items-center">
                                <User className="w-4 h-4 mr-2 text-orange-500" />
                                Username
                              </Label>
                            </Clerk.Label>
                            <Clerk.Input type="text" required asChild>
                              <Input className="h-14 rounded-2xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-orange-500 text-base transition-all duration-300" />
                            </Clerk.Input>
                            <Clerk.FieldError className="block text-sm text-red-500 ml-6" />
                          </Clerk.Field>

                          <SignUp.Action submit asChild>
                            <Button
                              disabled={isGlobalLoading}
                              className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base rounded-2xl transition-all duration-300 hover:scale-[1.02] focus:ring-4 focus:ring-orange-200"
                            >
                              <Clerk.Loading>
                                {(isLoading) => {
                                  return isLoading ? <Loader2 className="size-5 animate-spin" /> : "Complete Setup"
                                }}
                              </Clerk.Loading>
                            </Button>
                          </SignUp.Action>
                        </div>
                      </div>
                    </SignUp.Step>

                    <SignUp.Step name="verifications">
                      <SignUp.Strategy name="email_code">
                        <div className="space-y-8">
                          {/* Header */}
                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                                <Mail className="w-7 h-7 text-white" />
                              </div>
                              <div>
                                <h1 className="text-3xl font-light text-gray-900">Verify Email</h1>
                                <p className="text-gray-600">Enter the code sent to your email</p>
                              </div>
                            </div>
                          </div>

                          {/* OTP Input */}
                          <div className="space-y-6">
                            <div className="flex justify-center">
                              <Clerk.Field name="code" className="space-y-4">
                                <Clerk.Label className="sr-only">Verification code</Clerk.Label>
                                <div className="flex justify-center">
                                  <Clerk.Input
                                    type="otp"
                                    className="flex justify-center has-[:disabled]:opacity-50"
                                    autoSubmit
                                    render={({ value, status }) => {
                                      return (
                                        <div
                                          data-status={status}
                                          className={cn(
                                            "relative flex size-14 items-center justify-center bg-gray-50 text-xl font-semibold transition-all first:rounded-l-2xl last:rounded-r-2xl mx-1",
                                            {
                                              "ring-2 ring-orange-500 bg-orange-50":
                                                status === "cursor" || status === "selected",
                                            },
                                          )}
                                        >
                                          {value}
                                          {status === "cursor" && (
                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                              <div className="animate-caret-blink h-6 w-px bg-orange-500 duration-1000" />
                                            </div>
                                          )}
                                        </div>
                                      )
                                    }}
                                  />
                                </div>
                                <Clerk.FieldError className="block text-center text-sm text-red-500" />
                              </Clerk.Field>
                            </div>

                            <div className="text-center">
                              <SignUp.Action
                                asChild
                                resend
                                className="text-orange-600 hover:text-orange-700"
                                fallback={({ resendableAfter }) => (
                                  <span className="text-gray-500">Resend code in {resendableAfter}s</span>
                                )}
                              >
                                <button
                                  type="button"
                                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                                >
                                  Didn&apos;t receive a code? Resend
                                </button>
                              </SignUp.Action>
                            </div>

                            <SignUp.Action submit asChild>
                              <Button
                                disabled={isGlobalLoading}
                                className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base rounded-2xl transition-all duration-300 hover:scale-[1.02] focus:ring-4 focus:ring-orange-200"
                              >
                                <Clerk.Loading>
                                  {(isLoading) => {
                                    return isLoading ? <Loader2 className="size-5 animate-spin" /> : "Verify & Continue"
                                  }}
                                </Clerk.Loading>
                              </Button>
                            </SignUp.Action>
                          </div>
                        </div>
                      </SignUp.Strategy>
                    </SignUp.Step>
                  </>
                )
              }
            </Clerk.Loading>
          </SignUp.Root>
        </div>
      </div>
    </div>
  )
}
