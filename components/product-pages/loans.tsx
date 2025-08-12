"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Percent,
  ArrowRight,
  Shield,
  CheckCircle,
  List,
  FileText,
  Hash,
  Type,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import type { Product } from "@/types/product";
import { useGuruBot } from "@/providers/gurubot-provider";
import type { DynamicFormField } from "../shared/dynamic-form-fields";

interface ProductPageProps {
  product: Product;
  onApply?: (productId: string) => void;
  onCompare?: (productId: string) => void;
  onAskGuru?: (query: string, productId: string) => void;
}

export function ProductPage({ product, onAskGuru }: ProductPageProps) {
  const { askAboutProduct } = useGuruBot();

  const handleAskGuru = () => {
    const query = `Tell me more about the ${product.name} loan. What are the interest rates, terms, requirements, and application process?`;
    askAboutProduct(query, product.id);
    onAskGuru?.(query, product.id);
  };

  // Helper function to get field icon
  const getFieldIcon = (type: DynamicFormField["type"]) => {
    switch (type) {
      case "text":
        return <Type className="w-5 h-5" />;
      case "number":
        return <Hash className="w-5 h-5" />;
      case "percentage":
        return <Percent className="w-5 h-5" />;
      case "textarea":
        return <FileText className="w-5 h-5" />;
      case "list":
        return <List className="w-5 h-5" />;
      default:
        return <Type className="w-5 h-5" />;
    }
  };

  // Helper function to get field color scheme
  const getFieldColorScheme = (type: DynamicFormField["type"]) => {
    switch (type) {
      case "text":
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "",
        };
      case "number":
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "",
        };
      case "percentage":
        return {
          bg: "bg-stone-50",
          text: "text-stone-700",
          border: "",
        };
      case "textarea":
        return {
          bg: "bg-neutral-50",
          text: "text-neutral-700",
          border: "",
        };
      case "list":
        return {
          bg: "bg-zinc-50",
          text: "text-zinc-700",
          border: "",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "",
        };
    }
  };

  const getDisplayValue = (field: DynamicFormField) => {
    if (
      field.value &&
      field.value !== "" &&
      field.value !== null &&
      field.value !== undefined
    ) {
      return typeof field.value === "string"
        ? field.value
        : JSON.stringify(field.value);
    }
    return field.description || "Not specified";
  };

  const productImage = product.details.additionalInfo.find(
    (info) => info.id === "product-image"
  );
  const productUrl = product.details.additionalInfo.find(
    (info) => info.id === "product-url"
  );

  // Extract key financial details
  const interestRate = product.details.additionalInfo.find(
    (info) =>
      info.type === "percentage" && info.label.toLowerCase().includes("rate")
  );
  const maxAmount = product.details.additionalInfo.find(
    (info) =>
      info.type === "number" &&
      (info.label.toLowerCase().includes("amount") ||
        info.label.toLowerCase().includes("limit"))
  );
  const minAmount = product.details.additionalInfo.find(
    (info) =>
      info.type === "number" && info.label.toLowerCase().includes("minimum")
  );
  const term = product.details.additionalInfo.find(
    (info) =>
      info.label.toLowerCase().includes("term") ||
      info.label.toLowerCase().includes("duration")
  );
  const processingFee = product.details.additionalInfo.find(
    (info) =>
      info.label.toLowerCase().includes("fee") ||
      info.label.toLowerCase().includes("charge")
  );

  // Extract requirements and features
  const requirements = product.details.additionalInfo.filter(
    (info) =>
      info.label.toLowerCase().includes("requirement") ||
      info.label.toLowerCase().includes("eligibility") ||
      info.label.toLowerCase().includes("criteria")
  );

  const features = product.details.additionalInfo.filter(
    (info) =>
      info.label.toLowerCase().includes("feature") ||
      info.label.toLowerCase().includes("benefit") ||
      info.label.toLowerCase().includes("advantage")
  );

  const documents = product.details.additionalInfo.filter(
    (info) =>
      info.label.toLowerCase().includes("document") ||
      info.label.toLowerCase().includes("paperwork")
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {productImage && (
          <div className="absolute inset-0 opacity-20">
            <Image
              src={productImage.value.toString() || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-center space-x-4 mb-8">
            {product.institution?.logoUrl && (
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src={product.institution.logoUrl || "/placeholder.svg"}
                  alt={product.institution.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <p className="text-white/70 text-lg font-medium">
                {product.institution?.name}
              </p>
              <div className="flex items-center space-x-3 mt-2">
                {product.isFeatured && (
                  <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-400">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
                <Badge variant="outline" className="border-white/30 text-white">
                  {product.productType?.name || "Loan"}
                </Badge>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {product.name}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl leading-relaxed mb-12">
            {product.details.description}
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {interestRate && (
              <div className="text-left">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {interestRate.value
                    ? `${interestRate.value}%`
                    : getDisplayValue(interestRate)}
                </div>
                <div className="text-white/70 text-sm uppercase tracking-wide">
                  Interest Rate
                </div>
              </div>
            )}
            {minAmount && (
              <div className="text-left">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {minAmount.value
                    ? `$${
                        typeof minAmount.value === "number"
                          ? minAmount.value.toLocaleString()
                          : minAmount.value
                      }`
                    : getDisplayValue(minAmount)}
                </div>
                <div className="text-white/70 text-sm uppercase tracking-wide">
                  Min Amount
                </div>
              </div>
            )}
            {maxAmount && (
              <div className="text-left">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {maxAmount.value
                    ? `$${
                        typeof maxAmount.value === "number"
                          ? maxAmount.value.toLocaleString()
                          : maxAmount.value
                      }`
                    : getDisplayValue(maxAmount)}
                </div>
                <div className="text-white/70 text-sm uppercase tracking-wide">
                  Max Amount
                </div>
              </div>
            )}
            {term && (
              <div className="text-left">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {getDisplayValue(term)}
                </div>
                <div className="text-white/70 text-sm uppercase tracking-wide">
                  Loan Term
                </div>
              </div>
            )}
            {processingFee && (
              <div className="text-left">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {getDisplayValue(processingFee)}
                </div>
                <div className="text-white/70 text-sm uppercase tracking-wide">
                  Processing Fee
                </div>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {productUrl && productUrl.value && (
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                onClick={() =>
                  window.open(productUrl.value.toString(), "_blank")
                }
              >
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg font-semibold bg-transparent"
              onClick={handleAskGuru}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Ask Questions
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-20">
            {/* Features & Benefits */}
            {features.length > 0 && (
              <section>
                <h2 className="text-4xl font-bold text-gray-900 mb-12">
                  Why Choose This Loan?
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {features.map((feature) => {
                    const colorScheme = getFieldColorScheme(feature.type);
                    return (
                      <div
                        key={feature.id}
                        className="flex items-start space-x-4"
                      >
                        <div
                          className={`w-12 h-12 ${colorScheme.bg} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}
                        >
                          {getFieldIcon(feature.type)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {feature.label}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {getDisplayValue(feature)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <section>
                <h2 className="text-4xl font-bold text-gray-900 mb-12">
                  Eligibility Requirements
                </h2>
                <div className="space-y-8">
                  {requirements.map((req, index) => {
                    const colorScheme = getFieldColorScheme(req.type);
                    return (
                      <div key={req.id} className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-gray-600 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={colorScheme.text}>
                            {getFieldIcon(req.type)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {req.label}
                            </h3>
                            <p className="text-gray-700">
                              {getDisplayValue(req)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Documents Needed */}
            {documents.length > 0 && (
              <section>
                <h2 className="text-4xl font-bold text-gray-900 mb-12">
                  Documents You&apos;ll Need
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {documents.map((doc) => {
                    const colorScheme = getFieldColorScheme(doc.type);
                    return (
                      <div key={doc.id} className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <div className={colorScheme.text}>
                            {getFieldIcon(doc.type)}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {doc.label}
                          </h3>
                          <p className="text-sm text-gray-700">
                            {getDisplayValue(doc)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Comprehensive Field Details */}
            <section>
              {product.details.additionalInfo.length > 4 && (
                <h2 className="text-4xl font-bold text-gray-900 mb-12">
                  Complete Product Details
                </h2>
              )}
              <div className="space-y-8">
                {product.details.additionalInfo
                  .filter(
                    (info) =>
                      !["product-image", "product-url"].includes(info.id) &&
                      !(
                        info.type === "percentage" &&
                        info.label.toLowerCase().includes("rate")
                      ) &&
                      !(
                        info.type === "number" &&
                        (info.label.toLowerCase().includes("amount") ||
                          info.label.toLowerCase().includes("limit") ||
                          info.label.toLowerCase().includes("minimum"))
                      ) &&
                      !info.label.toLowerCase().includes("term") &&
                      !info.label.toLowerCase().includes("duration") &&
                      !info.label.toLowerCase().includes("fee") &&
                      !info.label.toLowerCase().includes("charge") &&
                      !info.label.toLowerCase().includes("requirement") &&
                      !info.label.toLowerCase().includes("eligibility") &&
                      !info.label.toLowerCase().includes("criteria") &&
                      !info.label.toLowerCase().includes("feature") &&
                      !info.label.toLowerCase().includes("benefit") &&
                      !info.label.toLowerCase().includes("advantage") &&
                      !info.label.toLowerCase().includes("document") &&
                      !info.label.toLowerCase().includes("paperwork")
                  )
                  .map((info) => {
                    const colorScheme = getFieldColorScheme(info.type);
                    return (
                      <div key={info.id} className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className={colorScheme.text}>
                            {getFieldIcon(info.type)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {info.label}
                          </h3>
                          <div className="text-gray-700 leading-relaxed">
                            {getDisplayValue(info)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>

            {/* Terms & Conditions */}
            {product.details.terms && (
              <section>
                <h2 className="text-4xl font-bold text-gray-900 mb-12">
                  Terms & Conditions
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>{product.details.terms}</p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Apply */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
              <p className="text-white/80 mb-6">
                Get started with your application in just a few minutes.
              </p>
              <Button
                size="lg"
                className="w-full bg-white text-slate-900 hover:bg-gray-100 mb-4"
                onClick={() =>
                  window.open(productUrl?.value.toString(), "_blank")
                }
              >
                Start Application
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <CheckCircle className="w-4 h-4 text-orange-400" />
                <span>Quick approval decision</span>
              </div>
            </div>

            {/* Lender Info */}
            {product.institution && (
              <div className="bg-gray-50 rounded-3xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  About the Lender
                </h3>
                <div className="flex items-center space-x-4 mb-6">
                  {product.institution.logoUrl && (
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                      <Image
                        src={product.institution.logoUrl || "/placeholder.svg"}
                        alt={product.institution.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {product.institution.name}
                    </h4>
                    <p className="text-gray-600">Trusted financial partner</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span>Licensed and regulated institution</span>
                </div>
              </div>
            )}

            {/* Contact Support */}
            <div className="bg-orange-50 rounded-3xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-6">
                Our loan experts are here to help you find the perfect solution.
              </p>
              <Button
                variant="outline"
                className="w-full border-orange-200 text-orange-700 hover:bg-orange-100 bg-transparent"
                onClick={handleAskGuru}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Expert
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
