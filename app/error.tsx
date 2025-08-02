"use client";

import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Mail,
  Phone,
  MessageCircle,
  ArrowLeft,
  Wifi,
  Server,
  FileX,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ErrorPageProps {
  error?: Error & { digest?: string };
  reset?: () => void;
  errorType?: "404" | "500" | "network" | "auth" | "generic";
  title?: string;
  message?: string;
}

export default function ErrorPage({
  error,
  reset,
  errorType = "generic",
  title,
  message,
}: ErrorPageProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  // Auto-detect error type based on error message or status
  const detectErrorType = () => {
    if (
      error?.message?.includes("404") ||
      error?.message?.toLowerCase().includes("not found")
    ) {
      return "404";
    }
    if (
      error?.message?.includes("500") ||
      error?.message?.toLowerCase().includes("server")
    ) {
      return "500";
    }
    if (
      error?.message?.toLowerCase().includes("network") ||
      error?.message?.toLowerCase().includes("fetch")
    ) {
      return "network";
    }
    if (
      error?.message?.toLowerCase().includes("auth") ||
      error?.message?.toLowerCase().includes("unauthorized")
    ) {
      return "auth";
    }
    return errorType;
  };

  const currentErrorType = detectErrorType();

  const handleRetry = async () => {
    if (reset) {
      setIsRetrying(true);
      // Add a small delay for better UX
      setTimeout(() => {
        reset();
        setIsRetrying(false);
      }, 1000);
    } else {
      // Fallback to page reload
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const getErrorContent = () => {
    switch (currentErrorType) {
      case "404":
        return {
          icon: <FileX className="w-12 h-12 text-orange-500" />,
          title: title || "Page Not Found",
          message:
            message ||
            "The page you're looking for doesn't exist or has been moved.",
          suggestions: [
            "Check the URL for any typos",
            "Use the navigation menu to find what you need",
            "Return to the homepage and start fresh",
          ],
          primaryAction: "Go to Homepage",
          primaryHandler: handleGoHome,
          showRetry: false,
        };

      case "500":
        return {
          icon: <Server className="w-12 h-12 text-orange-500" />,
          title: title || "Server Error",
          message:
            message ||
            "We're experiencing technical difficulties. Our team has been notified and is working on a fix.",
          suggestions: [
            "Try refreshing the page in a few moments",
            "Check if the issue persists across different pages",
            "Contact our support team if the problem continues",
          ],
          primaryAction: "Try Again",
          primaryHandler: handleRetry,
          showRetry: true,
        };

      case "network":
        return {
          icon: <Wifi className="w-12 h-12 text-orange-500" />,
          title: title || "Connection Problem",
          message:
            message ||
            "Unable to connect to our servers. Please check your internet connection and try again.",
          suggestions: [
            "Check your internet connection",
            "Try refreshing the page",
            "Disable any VPN or proxy if you're using one",
          ],
          primaryAction: "Retry Connection",
          primaryHandler: handleRetry,
          showRetry: true,
        };

      case "auth":
        return {
          icon: <Shield className="w-12 h-12 text-orange-500" />,
          title: title || "Authentication Required",
          message:
            message ||
            "You need to sign in to access this page. Please log in with your account credentials.",
          suggestions: [
            "Sign in with your existing account",
            "Create a new account if you don't have one",
            "Reset your password if you've forgotten it",
          ],
          primaryAction: "Sign In",
          primaryHandler: () => (window.location.href = "/sign-in"),
          showRetry: false,
        };

      default:
        return {
          icon: <AlertTriangle className="w-12 h-12 text-orange-500" />,
          title: title || "Something Went Wrong",
          message:
            message ||
            "We encountered an unexpected error. Don't worry, our team has been notified and is looking into it.",
          suggestions: [
            "Try refreshing the page",
            "Clear your browser cache and cookies",
            "Contact support if the issue persists",
          ],
          primaryAction: "Try Again",
          primaryHandler: handleRetry,
          showRetry: true,
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side - Error Illustration & Branding */}
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
                We&apos;re here to{" "}
                <span className="font-semibold text-orange-500">help</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Technical issues happen, but we&apos;re committed to getting you
                back on track quickly and securely.
              </p>
            </div>
          </div>

          {/* Support Options */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Need immediate assistance?
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Live Chat</p>
                  <p className="text-sm text-gray-600">
                    Available 24/7 for immediate help
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Support</p>
                  <p className="text-sm text-gray-600">support@bankguru.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone Support</p>
                  <p className="text-sm text-gray-600">1-800-BANKGURU</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Error Details & Actions */}
        <div className="w-full max-w-lg mx-auto lg:mx-0">
          <div className="space-y-8">
            {/* Error Header */}
            <div className="text-center lg:text-left space-y-6">
              <div className="flex justify-center lg:justify-start">
                <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center">
                  {errorContent.icon}
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-light text-gray-900">
                  {errorContent.title}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {errorContent.message}
                </p>
              </div>
            </div>

            {/* Error Details for Development */}
            {process.env.NODE_ENV === "development" && error && (
              <div className="p-4 bg-gray-50 rounded-2xl">
                <h4 className="font-medium text-gray-900 mb-2">
                  Technical Details (Development)
                </h4>
                <p className="text-sm text-gray-600 font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Suggestions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                What you can try:
              </h3>
              <ul className="space-y-3">
                {errorContent.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={errorContent.primaryHandler}
                disabled={isRetrying}
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base rounded-2xl transition-all duration-300 hover:scale-[1.02] focus:ring-4 focus:ring-orange-200"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    {errorContent.showRetry ? (
                      <RefreshCw className="w-5 h-5 mr-2" />
                    ) : (
                      <Home className="w-5 h-5 mr-2" />
                    )}
                    {errorContent.primaryAction}
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="h-12 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-2xl transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>

                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="h-12 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-2xl transition-all duration-300"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </div>
            </div>

            {/* Contact Support */}
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <p className="text-gray-600 mb-4">Still having trouble?</p>
              <Button
                onClick={() =>
                  (window.location.href = "mailto:support@bankguru.com")
                }
                variant="outline"
                className="bg-white hover:bg-gray-50 text-orange-600 border-orange-200 hover:border-orange-300 font-medium rounded-xl transition-all duration-300"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
