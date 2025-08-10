"use client";

import { ReactNode, useState } from "react";
import { SheetContainer } from "@/components/shared/sheet-container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Share2,
  Facebook,
  MessageCircle,
  Twitter,
  Send,
  Linkedin,
  Copy,
  Mail,
  Building2,
  Percent,
  Calculator,
  Check,
  Link,
} from "lucide-react";
import { Product } from "@/types/product";
import Image from "next/image";

interface ShareProductProps {
  product: Product;
  triggerIcon?: ReactNode;
  triggerText?: string;
  className?: string;
}

export function ShareProduct({
  product,
  triggerIcon = <Share2 className="w-4 h-4" />,
  triggerText = "Share",
  className,
}: ShareProductProps) {
  const [copied, setCopied] = useState(false);
  const productUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/services/shares/product/${product.id}?catId=${product.productType?.categoryId}`
      : "";

  const shareText = `Check out this ${
    product.productType?.name || "loan"
  } from ${product.institution?.name}: ${product.name}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(productUrl);

  // Extract product details
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

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent(
      `Great ${product.productType?.name || "loan"} option`
    )}&body=${encodedText}%20${encodedUrl}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
    toast.success(
      `Shared to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareOptions = [
    {
      platform: "facebook" as const,
      label: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      color: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700",
    },
    {
      platform: "whatsapp" as const,
      label: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "hover:bg-green-50 hover:border-green-200 hover:text-green-700",
    },
    {
      platform: "twitter" as const,
      label: "X (Twitter)",
      icon: <Twitter className="w-5 h-5" />,
      color: "hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
    },
    {
      platform: "telegram" as const,
      label: "Telegram",
      icon: <Send className="w-5 h-5" />,
      color: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700",
    },
    {
      platform: "linkedin" as const,
      label: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      color: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700",
    },
    {
      platform: "email" as const,
      label: "Email",
      icon: <Mail className="w-5 h-5" />,
      color: "hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700",
    },
  ];

  return (
    <SheetContainer
      title="Share Product"
      triggerText={triggerText}
      triggerIcon={triggerIcon}
      side="right"
      className={className}
    >
      <div className="space-y-6">
        {/* Product Preview Card */}
        <div className="p-4 border border-gray-200 rounded-lg bg-white">
          <div className="flex items-start space-x-4">
            {/* Product Image or Institution Logo */}
            <div className="flex-shrink-0">
              {productImage ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={productImage.value.toString()}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : product.institution?.logoUrl ? (
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border">
                  <Image
                    src={product.institution.logoUrl}
                    alt={product.institution.name}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                {product.name}
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                {product.institution?.name}
              </p>

              {/* Key Metrics */}
              <div className="flex items-center space-x-4">
                {interestRate && (
                  <div className="flex items-center space-x-1">
                    <Percent className="w-3 h-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">
                      {interestRate.value}%
                    </span>
                  </div>
                )}
                {maxAmount && (
                  <div className="flex items-center space-x-1">
                    <Calculator className="w-3 h-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">
                      ${maxAmount.value}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
            <h4 className="text-sm font-semibold text-gray-900">
              Share to platforms
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => (
              <Button
                key={option.platform}
                onClick={() => handleShare(option.platform)}
                variant="outline"
                className={`h-12 flex items-center justify-start space-x-3 px-4 border-gray-200 bg-white transition-all duration-200 ${option.color}`}
              >
                <div className="flex-shrink-0">{option.icon}</div>
                <span className="text-sm font-medium">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Copy Link Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-4 bg-green-500 rounded-full"></div>
            <h4 className="text-sm font-semibold text-gray-900">
              Share link directly
            </h4>
          </div>

          <div className="space-y-3">
            {/* URL Display */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <Link className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-700">
                  Product URL
                </span>
              </div>
              <div className="text-xs text-gray-600 font-mono break-all leading-relaxed">
                {productUrl}
              </div>
            </div>

            {/* Copy Button */}
            <Button
              onClick={handleCopyLink}
              variant={copied ? "default" : "outline"}
              className={`w-full h-11 transition-all duration-200 ${
                copied
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied to clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy link to clipboard
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </SheetContainer>
  );
}
