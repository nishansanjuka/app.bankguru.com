"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Mail,
  Lock,
  Shield,
  CheckCircle,
  Building2,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { Icons } from "@/data/icons";

export default function SignInPage() {
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
                Welcome back to{" "}
                <span className="font-semibold text-orange-500">BankGuru</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Continue your journey to smarter financial decisions with access
                to comprehensive comparisons and insights.
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
                  Secure Access
                </h3>
                <p className="text-gray-600">
                  Your account is protected with multi-factor authentication and
                  advanced security measures.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Real-time Updates
                </h3>
                <p className="text-gray-600">
                  Get instant access to the latest rates and financial product
                  information.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Trusted Platform
                </h3>
                <p className="text-gray-600">
                  Join thousands of users making informed financial decisions
                  daily.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8">
            <p className="text-sm text-gray-500 mb-4">
              Trusted by leading financial institutions
            </p>
            <div className="grid grid-cols-4 gap-6 ">
              <Image
                src={"/bank-logos/amana.png"}
                alt=""
                width={60}
                height={20}
                className="h-6 object-contain"
              />
              <Image
                src={"/bank-logos/boc.jpg"}
                alt=""
                width={60}
                height={20}
                className="h-6 object-contain"
              />
              <Image
                src={"/bank-logos/combank.webp"}
                alt=""
                width={60}
                height={20}
                className="h-6 object-contain"
              />
              <Image
                src={"/bank-logos/hnb.png"}
                alt=""
                width={60}
                height={20}
                className="h-6 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-lg mx-auto lg:mx-0">
          <SignIn.Root>
            <Clerk.Loading>
              {(isGlobalLoading) => (
                <>
                  <SignIn.Step name="start">
                    <div className="space-y-8">
                      {/* Header */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                            <Mail className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h1 className="text-3xl font-light text-gray-900">
                              Sign In
                            </h1>
                            <p className="text-gray-600">
                              Welcome back! Please sign in to continue
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
                            <span className="px-6 bg-white text-gray-500 font-medium">
                              or continue with email
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-6">
                        <Clerk.Field name="identifier" className="space-y-3">
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
                      </div>

                      {/* Submit */}
                      <div className="space-y-6">
                        <SignIn.Action submit asChild>
                          <Button
                            disabled={isGlobalLoading}
                            className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base rounded-2xl transition-all duration-300 hover:scale-[1.02] focus:ring-4 focus:ring-orange-200"
                          >
                            <Clerk.Loading>
                              {(isLoading) => {
                                return isLoading ? (
                                  <Loader2 className="size-5 animate-spin" />
                                ) : (
                                  "Continue"
                                );
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignIn.Action>

                        <div className="text-center">
                          <Clerk.Link
                            navigate="sign-up"
                            className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                          >
                            Don&apos;t have an account? Sign up
                          </Clerk.Link>
                        </div>
                      </div>
                    </div>
                  </SignIn.Step>

                  <SignIn.Step name="choose-strategy">
                    <div className="space-y-8">
                      {/* Header */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                            <Shield className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h1 className="text-3xl font-light text-gray-900">
                              Choose Method
                            </h1>
                            <p className="text-gray-600">
                              Select your preferred sign-in method
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Strategy Options */}
                      <div className="space-y-4">
                        <SignIn.SupportedStrategy name="email_code" asChild>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isGlobalLoading}
                            className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-2xl transition-all duration-300 hover:scale-[1.02] focus:ring-4 focus:ring-orange-200 justify-start"
                          >
                            <Mail className="mr-3 w-5 h-5 text-orange-500" />
                            Email verification code
                          </Button>
                        </SignIn.SupportedStrategy>

                        <SignIn.SupportedStrategy name="password" asChild>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isGlobalLoading}
                            className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-2xl transition-all duration-300 hover:scale-[1.02] focus:ring-4 focus:ring-orange-200 justify-start"
                          >
                            <Lock className="mr-3 w-5 h-5 text-orange-500" />
                            Password
                          </Button>
                        </SignIn.SupportedStrategy>
                      </div>

                      {/* Back Button */}
                      <div>
                        <SignIn.Action navigate="previous" asChild>
                          <Button
                            variant="outline"
                            disabled={isGlobalLoading}
                            className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-2xl transition-all duration-300"
                          >
                            <Clerk.Loading>
                              {(isLoading) => {
                                return isLoading ? (
                                  <Loader2 className="size-5 animate-spin" />
                                ) : (
                                  <>
                                    <ArrowLeft className="mr-2 w-4 h-4" />
                                    Go back
                                  </>
                                );
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignIn.Action>
                      </div>
                    </div>
                  </SignIn.Step>

                  <SignIn.Step name="verifications">
                    <SignIn.Strategy name="password">
                      <div className="space-y-8">
                        {/* Header */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                              <Lock className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h1 className="text-3xl font-light text-gray-900">
                                Enter Password
                              </h1>
                              <p className="text-gray-600">
                                Welcome back <SignIn.SafeIdentifier />
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                          <Clerk.Field name="password" className="space-y-3">
                            <Clerk.Label asChild>
                              <Label className="text-gray-800 font-medium text-base flex items-center">
                                <Lock className="w-4 h-4 mr-2 text-orange-500" />
                                Password
                              </Label>
                            </Clerk.Label>
                            <Clerk.Input type="password" asChild>
                              <Input className="h-14 rounded-2xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-orange-500 text-base transition-all duration-300" />
                            </Clerk.Input>
                            <Clerk.FieldError className="block text-sm text-red-500 ml-6" />
                          </Clerk.Field>

                          <SignIn.Action submit asChild>
                            <Button
                              disabled={isGlobalLoading}
                              className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base rounded-2xl transition-all duration-300 hover:scale-[1.02] focus:ring-4 focus:ring-orange-200"
                            >
                              <Clerk.Loading>
                                {(isLoading) => {
                                  return isLoading ? (
                                    <Loader2 className="size-5 animate-spin" />
                                  ) : (
                                    "Sign In"
                                  );
                                }}
                              </Clerk.Loading>
                            </Button>
                          </SignIn.Action>

                          <div className="text-center">
                            <SignIn.Action navigate="choose-strategy" asChild>
                              <button
                                type="button"
                                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                              >
                                Use another method
                              </button>
                            </SignIn.Action>
                          </div>
                        </div>
                      </div>
                    </SignIn.Strategy>

                    <SignIn.Strategy name="email_code">
                      <div className="space-y-8">
                        {/* Header */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                              <Mail className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h1 className="text-3xl font-light text-gray-900">
                                Check Your Email
                              </h1>
                              <p className="text-gray-600">
                                Enter the code sent to <SignIn.SafeIdentifier />
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* OTP Input */}
                        <div className="space-y-6">
                          <Clerk.Field name="code">
                            <Clerk.Label className="sr-only">
                              Email verification code
                            </Clerk.Label>
                            <div className="space-y-4">
                              <div className="flex justify-center">
                                <Clerk.Input
                                  type="otp"
                                  autoSubmit
                                  className="flex justify-center has-[:disabled]:opacity-50"
                                  render={({ value, status }) => {
                                    return (
                                      <div
                                        data-status={status}
                                        className={cn(
                                          "relative flex size-14 items-center justify-center bg-gray-50 text-xl font-semibold transition-all first:rounded-l-2xl last:rounded-r-2xl mx-1",
                                          {
                                            "ring-2 ring-orange-500 bg-orange-50":
                                              status === "cursor" ||
                                              status === "selected",
                                          }
                                        )}
                                      >
                                        {value}
                                        {status === "cursor" && (
                                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                            <div className="animate-caret-blink h-6 w-px bg-orange-500 duration-1000" />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }}
                                />
                              </div>
                              <Clerk.FieldError className="block text-center text-sm text-red-500" />
                            </div>
                          </Clerk.Field>

                          <div className="text-center">
                            <SignIn.Action
                              asChild
                              resend
                              className="text-orange-600 hover:text-orange-700"
                              fallback={({
                                resendableAfter,
                              }: {
                                resendableAfter: number;
                              }) => (
                                <span className="text-gray-500">
                                  Resend code in {resendableAfter}s
                                </span>
                              )}
                            >
                              <button
                                type="button"
                                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                              >
                                Didn&apos;t receive a code? Resend
                              </button>
                            </SignIn.Action>
                          </div>

                          <SignIn.Action submit asChild>
                            <Button
                              disabled={isGlobalLoading}
                              className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base rounded-2xl transition-all duration-300 hover:scale-[1.02] focus:ring-4 focus:ring-orange-200"
                            >
                              <Clerk.Loading>
                                {(isLoading) => {
                                  return isLoading ? (
                                    <Loader2 className="size-5 animate-spin" />
                                  ) : (
                                    "Verify & Sign In"
                                  );
                                }}
                              </Clerk.Loading>
                            </Button>
                          </SignIn.Action>

                          <div className="text-center">
                            <SignIn.Action navigate="choose-strategy" asChild>
                              <button
                                type="button"
                                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                              >
                                Use another method
                              </button>
                            </SignIn.Action>
                          </div>
                        </div>
                      </div>
                    </SignIn.Strategy>
                  </SignIn.Step>
                </>
              )}
            </Clerk.Loading>
          </SignIn.Root>
        </div>
      </div>
    </div>
  );
}
