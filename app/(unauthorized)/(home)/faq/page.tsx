import { Button } from "@/components/ui/button";
import { ChevronDown, HelpCircle, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "FAQ - BankGuru",
  description:
    "Frequently asked questions about BankGuru's financial services comparison platform.",
  icons: {
    icon: "/logo/logo.png",
  },
};

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What is BankGuru?",
        answer:
          "BankGuru is Sri Lanka's leading financial services comparison platform that helps you find the best credit cards, loans, mortgages, and banking products tailored to your needs. We provide real-time data and unbiased analysis to help you make smarter financial decisions.",
      },
      {
        question: "How do I get started with BankGuru?",
        answer:
          "Simply sign up for a free account to access our comparison tools. You can browse products without registration, but creating an account allows you to save comparisons, set up alerts, and get personalized recommendations.",
      },
      {
        question: "Is BankGuru free to use?",
        answer:
          "Yes, BankGuru is completely free for consumers. We earn revenue through partnerships with financial institutions, but this never affects our unbiased product comparisons or recommendations.",
      },
    ],
  },
  {
    category: "Product Comparisons",
    questions: [
      {
        question: "How accurate is your product information?",
        answer:
          "We update our product information daily and work directly with financial institutions to ensure accuracy. However, terms and rates can change frequently, so we always recommend confirming details directly with the provider before applying.",
      },
      {
        question: "Can I apply for products directly through BankGuru?",
        answer:
          "Yes, for many products you can start your application directly through our platform. We'll redirect you to the provider's secure application process to complete your application.",
      },
      {
        question: "How do you determine the best products for me?",
        answer:
          "Our recommendation engine considers multiple factors including your credit profile, income, existing relationships, and stated preferences to suggest the most suitable products for your situation.",
      },
    ],
  },
  {
    category: "Account & Security",
    questions: [
      {
        question: "Is my personal information secure?",
        answer:
          "Absolutely. We use bank-level encryption and security measures to protect your data. We never sell your personal information and only share it with institutions when you explicitly choose to apply for their products.",
      },
      {
        question: "How do I update my profile information?",
        answer:
          "Log in to your account and visit your profile settings to update your personal information, preferences, and notification settings at any time.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can delete your account at any time from your account settings. This will permanently remove all your data from our system.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "I'm having trouble with the website. What should I do?",
        answer:
          "First, try refreshing the page or clearing your browser cache. If the issue persists, please contact our support team with details about the problem and we'll help resolve it quickly.",
      },
      {
        question: "Do you have a mobile app?",
        answer:
          "Currently, we offer a mobile-optimized website that works great on all devices. A dedicated mobile app is in development and will be available soon.",
      },
      {
        question: "Which browsers do you support?",
        answer:
          "BankGuru works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white pt-14 sm:pt-28">
      {/* Hero Section */}
      <div className="bg-[#4B4B4B] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about BankGuru&#39;s services,
            features, and how we help you make better financial decisions.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-12">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-orange-500 pb-2">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => (
                  <details
                    key={questionIndex}
                    className="group bg-gray-50 rounded-lg overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-100 transition-colors">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <ChevronDown className="w-5 h-5 text-orange-500 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-20 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can&apos;t find the answer you&apos;re looking for? Our support team
            is here to help you with any questions about our platform or
            services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Link>
            <Link href="mailto:support@bankguru.com">
              <Button
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
