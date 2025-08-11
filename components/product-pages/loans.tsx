"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  Percent,
  Calculator,
  ArrowRight,
  Building2,
  Shield,
  CheckCircle,
  Bot,
  List,
  FileText,
  Hash,
  Type,
} from "lucide-react";
import Image from "next/image";
import type { Product } from "@/types/product";
import { useGuruBot } from "@/providers/gurubot-provider";
import { DynamicFormField, type ListItem } from "../shared/dynamic-form-fields";

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
          bg: "bg-blue-100",
          text: "text-blue-600",
          border: "border-blue-200",
        };
      case "number":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          border: "border-green-200",
        };
      case "percentage":
        return {
          bg: "bg-orange-100",
          text: "text-orange-600",
          border: "border-orange-200",
        };
      case "textarea":
        return {
          bg: "bg-purple-100",
          text: "text-purple-600",
          border: "border-purple-200",
        };
      case "list":
        return {
          bg: "bg-indigo-100",
          text: "text-indigo-600",
          border: "border-indigo-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          border: "border-gray-200",
        };
    }
  };

  // Extract special fields
  const productImage = product.details.additionalInfo.find(
    (info) => info.id === "product-image"
  );
  const productUrl = product.details.additionalInfo.find(
    (info) => info.id === "product-url"
  );

  // Group fields by type for organized display
  const fieldsByType = product.details.additionalInfo
    .filter((info) => info.id !== "product-url" && info.id !== "product-image")
    .reduce((acc, field) => {
      if (!acc[field.type]) {
        acc[field.type] = [];
      }
      acc[field.type].push(field);
      return acc;
    }, {} as Record<string, DynamicFormField[]>);

  // Extract key metrics for the metrics bar
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

  // const formatFees = (fees: string | number) => {
  //   if (typeof fees === "number") {
  //     return `${fees}%`;
  //   }
  //   return fees || "N/A";
  // };

  // const formatEligibility = (eligibility: string | number) => {
  //   if (typeof eligibility === "number") {
  //     return `${eligibility}+ years`;
  //   }
  //   return eligibility || "N/A";
  // };

  // Render list items with optional sublists
  const renderListItems = (items: ListItem[]) => {
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id || index} className="space-y-2">
            {/* Main item */}
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
              <span className="text-gray-700 font-medium">{item.value}</span>
            </div>

            {/* Subitems */}
            {item.sublist && item.sublist.length > 0 && (
              <div className="ml-5 space-y-2">
                {item.sublist.map((subItem, subIndex) => (
                  <div key={subIndex} className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{subItem}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render field value based on type
  const renderFieldValue = (field: DynamicFormField) => {
    switch (field.type) {
      case "percentage":
        return (
          <span className="text-2xl font-bold text-gray-900">
            {field.value}%
          </span>
        );
      case "number":
        return (
          <span className="text-2xl font-bold text-gray-900">
            {typeof field.value === "number"
              ? field.value.toLocaleString()
              : field.value}
          </span>
        );
      case "list":
        return field.listItems && field.listItems.length > 0 ? (
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                {field.listItems.length} items
                {field.listItems.some(
                  (item) => item.sublist && item.sublist.length > 0
                ) && (
                  <span className="text-xs text-gray-500 ml-2">
                    (with subitems)
                  </span>
                )}
              </span>
            </div>
            {renderListItems(field.listItems)}
          </div>
        ) : (
          <span className="text-gray-500 italic">No items</span>
        );
      case "textarea":
        return (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {field.value}
            </p>
          </div>
        );
      default:
        return <span className="text-gray-900">{field.value}</span>;
    }
  };

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
                <div className="text-sm text-gray-600">
                  {interestRate.label}
                </div>
              </div>
            )}
            {maxAmount && (
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  $
                  {typeof maxAmount.value === "number"
                    ? maxAmount.value.toLocaleString()
                    : maxAmount.value}
                </div>
                <div className="text-sm text-gray-600">{maxAmount.label}</div>
              </div>
            )}
            {/* <div className="text-center">
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
            </div> */}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 md:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Dynamic Fields by Type */}
              {Object.entries(fieldsByType).map(([type, fields]) => {
                const colorScheme = getFieldColorScheme(
                  type as DynamicFormField["type"]
                );
                const icon = getFieldIcon(type as DynamicFormField["type"]);

                return (
                  <div key={type}>
                    <div className="flex items-center space-x-3 mb-8">
                      <div
                        className={`w-10 h-10 ${colorScheme.bg} rounded-full flex items-center justify-center`}
                      >
                        <div className={colorScheme.text}>{icon}</div>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 capitalize">
                        {type === "textarea"
                          ? "Detailed Information"
                          : `${type} Fields`}
                      </h2>
                    </div>

                    {type === "list" ? (
                      // Special layout for list fields
                      <div className="space-y-6">
                        {fields.map((field) => (
                          <Card key={field.id} className="overflow-hidden p-0">
                            <CardHeader
                              className={`${colorScheme.bg} ${colorScheme.border} border-b`}
                            >
                              <CardTitle className="flex items-center space-x-3 pt-2">
                                <div className={colorScheme.text}>{icon}</div>
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900">
                                    {field.label}
                                  </h3>
                                  {field.title && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      {field.title}
                                    </p>
                                  )}
                                </div>
                              </CardTitle>
                              {field.description && (
                                <p className="text-sm text-gray-600 mt-2">
                                  {field.description}
                                </p>
                              )}
                            </CardHeader>
                            <CardContent className="p-6">
                              {renderFieldValue(field)}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : type === "textarea" ? (
                      // Special layout for textarea fields
                      <div className="space-y-6">
                        {fields.map((field) => (
                          <Card key={field.id} className="p-0">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-3">
                                <div
                                  className={`w-8 h-8 ${colorScheme.bg} rounded-full flex items-center justify-center`}
                                >
                                  <div className={colorScheme.text}>{icon}</div>
                                </div>
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900">
                                    {field.label}
                                  </h3>
                                  {field.title && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      {field.title}
                                    </p>
                                  )}
                                </div>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {renderFieldValue(field)}
                              {field.description && (
                                <p className="text-sm text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
                                  {field.description}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      // Grid layout for other field types
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fields.map((field) => (
                          <Card key={field.id} className="text-center p-0">
                            <CardContent className="p-6">
                              <div
                                className={`w-12 h-12 ${colorScheme.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
                              >
                                <div className={colorScheme.text}>{icon}</div>
                              </div>
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {field.label}
                              </h3>
                              {field.title && (
                                <p className="text-sm text-gray-600 mb-3">
                                  {field.title}
                                </p>
                              )}
                              <div className="mb-3">
                                {renderFieldValue(field)}
                              </div>
                              {field.description && (
                                <p className="text-xs text-gray-500 mt-2">
                                  {field.description}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Terms & Conditions */}
              {product.details.terms && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Terms & Conditions
                  </h2>
                  <Card className="p-0">
                    <CardContent className="p-8">
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {product.details.terms}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Apply Section */}
              <Card className="sticky top-8 p-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Ready to Apply?
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={handleAskGuru}
                        variant="outline"
                        size="icon"
                        className="size-12 rounded-xl hover:bg-gray-50 bg-transparent"
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
                        className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl"
                      >
                        Apply Now
                        <ArrowRight className="w-5 h-5 ml-2" />
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
                </CardContent>
              </Card>

              {/* Institution Info */}
              {product.institution && (
                <Card className="p-0">
                  <CardContent className="p-8">
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
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
