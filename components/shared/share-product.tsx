"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  CheckCheck,
} from "lucide-react";
import { Product } from "@/types/product";

interface ShareProductProps {
  product: Product;
  triggerIcon?: ReactNode;
  triggerText?: string;
  className?: string;
}

export function ShareProduct({
  product,
  triggerIcon = <Share2 className="w-4 h-4" />,
  triggerText,
  className,
}: ShareProductProps) {
  const [copied, setCopied] = useState(false);
  const productUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/services/shares/product/${product.id}?catId=${product.productType?.categoryId}`
      : "";

  const shareText = `Check out this ${
    product.productType?.name || "product"
  } from ${product.institution?.name}: ${product.name}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(productUrl);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent(
      `Great ${product.productType?.name || "product"} option`
    )}&body=${encodedText}%20${encodedUrl}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
    toast.success("Shared successfully!");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareOptions = [
    {
      platform: "facebook" as const,
      icon: <Facebook className="w-4 h-4" />,
      color: "",
      title: "Share on Facebook",
    },
    {
      platform: "whatsapp" as const,
      icon: <MessageCircle className="w-4 h-4" />,
      color: "",
      title: "Share on WhatsApp",
    },
    {
      platform: "twitter" as const,
      icon: <Twitter className="w-4 h-4" />,
      color: "",
      title: "Share on X (Twitter)",
    },
    {
      platform: "telegram" as const,
      icon: <Send className="w-4 h-4" />,
      color: "",
      title: "Share on Telegram",
    },
    {
      platform: "linkedin" as const,
      icon: <Linkedin className="w-4 h-4" />,
      color: "",
      title: "Share on LinkedIn",
    },
    {
      platform: "email" as const,
      icon: <Mail className="w-4 h-4" />,
      color: "",
      title: "Share via Email",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 px-2 gap-1.5 ${className}`}
        >
          {triggerIcon}
          {triggerText && <span className="text-xs">{triggerText}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-auto p-2"
        side="bottom"
        sideOffset={4}
      >
        <div className="flex items-center gap-1">
          {shareOptions.map((option) => (
            <Button
              key={option.platform}
              onClick={() => handleShare(option.platform)}
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 transition-all duration-200 text-muted-foreground ${option.color}`}
              title={option.title}
            >
              {option.icon}
            </Button>
          ))}
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <Button
            onClick={handleCopyLink}
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 transition-all duration-200 text-muted-foreground ${
              copied ? "hover:text-green-500 text-green-500" : ""
            }`}
            title={copied ? "Copied!" : "Copy link"}
          >
            {copied ? (
              <CheckCheck className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
