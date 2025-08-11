"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Percent,
  Calculator,
  Clock,
  ArrowRight,
  Building2,
  Shield,
  TrendingUp,
  Zap,
  CheckCircle,
  DollarSign,
  Users,
  Bot,
} from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useGuruBot } from "@/providers/gurubot-provider";

interface ProductPageProps {
  product: Product;
  onApply?: (productId: string) => void;
  onCompare?: (productId: string) => void;
  onAskGuru?: (query: string, productId: string) => void;
}

export function ProductPage({ product, onApply, onAskGuru }: ProductPageProps) {
  const { askAboutProduct } = useGuruBot();

  const handleAskGuru = () => {
    const query = `Tell me more about the ${product.name} loan. What are the interest rates, terms, requirements, and application process?`;
    // Use the GuruBot provider directly
    askAboutProduct(query, product.id);
    // Also call the callback if provided for consistency
    onAskGuru?.(query, product.id);
  };

  // Extract key information
  const interestRate = product.details.additionalInfo.find(
    (info) => info.type === "percentage"
  );

  const maxAmount = product.details.additionalInfo.find(
    (info) =>
      info.type === "number" &&
      (info.label.toLowerCase().includes("amount") ||
        info.label.toLowerCase().includes("limit"))
  );

  const productImage = product.details.additionalInfo.find(
    (info) => info.id === "product-image"
  );

  const productUrl = product.details.additionalInfo.find(
    (info) => info.id === "product-url"
  );

  const formatFees = (fees: string | number) => {
    if (typeof fees === "number") {
      return `${fees}%`;
    }
    return fees || "N/A";
  };

  const formatEligibility = (eligibility: string | number) => {
    if (typeof eligibility === "number") {
      return `${eligibility}+ years`;
    }
    return eligibility || "N/A";
  };

  // Group additional info by type for better organization
  // Exclude product-url and product-image as they're used elsewhere
  const textFields = product.details.additionalInfo.filter(
    (info) =>
      info.type === "text" &&
      info.id !== "product-url" &&
      info.id !== "product-image"
  );
  const numberFields = product.details.additionalInfo.filter(
    (info) =>
      info.type === "number" &&
      info.id !== "product-url" &&
      info.id !== "product-image"
  );
  const percentageFields = product.details.additionalInfo.filter(
    (info) =>
      info.type === "percentage" &&
      info.id !== "product-url" &&
      info.id !== "product-image"
  );
  const textareaFields = product.details.additionalInfo.filter(
    (info) =>
      info.type === "textarea" &&
      info.id !== "product-url" &&
      info.id !== "product-image"
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <section className="relative h-[60vh] min-h-[400px] bg-gradient-to-br from-slate-50 to-gray-100">
        {productImage ? (
          <div className="absolute inset-0">
            <Image
              src={productImage.value.toString() || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Building2 className="w-16 h-16 text-white" />
            </div>
          </div>
        )}

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full bg-gradient-to-t from-black/60 to-transparent p-8 md:p-12">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center space-x-4 mb-4">
                {product.institution?.logoUrl && (
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                      src={product.institution.logoUrl || "/placeholder.svg"}
                      alt={product.institution.name}
                      width={32}
                      height={32}
                      className="rounded object-contain"
                    />
                  </div>
                )}
                <div>
                  <p className="text-white/80 text-sm font-medium">
                    {product.institution?.name}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    {product.isFeatured && (
                      <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-400">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30"
                    >
                      {product.productType?.name || "Loan"}
                    </Badge>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {product.name}
              </h1>

              <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
                {product.details.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Bar */}
      <section className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-8 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {interestRate && (
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                  <Percent className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {interestRate.value}%
                </div>
                <div className="text-sm text-gray-600">Interest Rate</div>
              </div>
            )}

            {maxAmount && (
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${maxAmount.value.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Maximum Amount</div>
              </div>
            )}

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {formatFees(product.details.fees)}
              </div>
              <div className="text-sm text-gray-600">Processing Fee</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {formatEligibility(product.details.eligibility)}
              </div>
              <div className="text-sm text-gray-600">Minimum Age</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 md:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Key Features */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Key Features
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Quick Approval
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Get approved within 24 hours with our streamlined
                        process
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Flexible Terms
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Choose repayment terms that work for your budget
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Competitive Rates
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Industry-leading interest rates for qualified borrowers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Trusted Choice
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Highly rated with excellent customer satisfaction
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              {product.details.terms && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Terms & Conditions
                  </h2>
                  <div className="bg-white p-8 rounded-2xl">
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {product.details.terms}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {product.details.additionalInfo.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Additional Information
                  </h2>
                  <div className="space-y-6">
                    {/* Text Fields */}
                    {textFields.length > 0 && (
                      <div className="bg-white p-8 rounded-2xl">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          Product Details
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {textFields.map((field) => (
                            <div key={field.id}>
                              <dt className="text-sm font-medium text-gray-600 mb-2">
                                {field.label}
                              </dt>
                              <dd className="text-gray-900">{field.value}</dd>
                              {field.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {field.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Number and Percentage Fields */}
                    {(numberFields.length > 0 ||
                      percentageFields.length > 0) && (
                      <div className="bg-white p-8 rounded-2xl">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          Financial Details
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                          {[...numberFields, ...percentageFields].map(
                            (field) => (
                              <div
                                key={field.id}
                                className="text-center p-4 bg-gray-50 rounded-xl"
                              >
                                <dt className="text-sm font-medium text-gray-600 mb-2">
                                  {field.label}
                                </dt>
                                <dd className="text-2xl font-bold text-gray-900">
                                  {field.type === "percentage"
                                    ? `${field.value}%`
                                    : field.value}
                                </dd>
                                {field.description && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    {field.description}
                                  </p>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Textarea Fields */}
                    {textareaFields.length > 0 && (
                      <div className="bg-white p-8 rounded-2xl">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          Detailed Information
                        </h3>
                        <div className="space-y-6">
                          {textareaFields.map((field) => (
                            <div key={field.id}>
                              <dt className="text-lg font-medium text-gray-900 mb-3">
                                {field.label}
                              </dt>
                              <dd className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {field.value}
                              </dd>
                              {field.description && (
                                <p className="text-sm text-gray-500 mt-2">
                                  {field.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Apply Section */}
              <div className="bg-white p-8 rounded-2xl sticky top-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Ready to Apply?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Button
                      onClick={handleAskGuru}
                      variant="outline"
                      size={"icon"}
                      className=" size-12 rounded-xl hover:bg-gray-50 bg-transparent"
                    >
                      <Bot className="w-4 h-4 text-orange-500" />
                    </Button>
                    <Button
                      onClick={() => {
                        if (productUrl) {
                          window.open(productUrl.value.toString(), "_blank");
                        } else {
                          onApply?.(product.id);
                        }
                      }}
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl"
                    >
                      Apply Now
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No hidden fees</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure application process</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Quick approval decision</span>
                  </div>
                </div>
              </div>

              {/* Institution Info */}
              {product.institution && (
                <div className="bg-white p-8 rounded-2xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    About the Lender
                  </h3>
                  <div className="flex items-center space-x-4 mb-4">
                    {product.institution.logoUrl && (
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                        <Image
                          src={
                            product.institution.logoUrl || "/placeholder.svg"
                          }
                          alt={product.institution.name}
                          width={48}
                          height={48}
                          className="rounded object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {product.institution.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Trusted financial partner
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Licensed and regulated institution</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
