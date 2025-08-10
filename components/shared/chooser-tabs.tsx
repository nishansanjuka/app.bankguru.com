import { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  TrendingUp,
  Shield,
  Calculator,
  Home,
  CreditCard,
  Star,
} from "lucide-react";
import Image from "next/image";
import { GuruBotTriggerButton } from "../gurubot/gurubot-triggers";

const PostCard: FC<{
  title: string;
  description: string;
  image: string;
  readTime: string;
  category: string;
  featured?: boolean;
}> = ({ title, description, image, category, featured = false }) => (
  <Card
    className={`group hover:shadow-lg transition-all p-0 duration-300 ${
      featured ? "border-orange-500" : ""
    }`}
  >
    <div className="relative overflow-hidden rounded-t-xl">
      <Image
        src={image}
        alt={title}
        width={400}
        height={240}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {featured && (
        <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
          Featured
        </Badge>
      )}
      <Badge className="absolute top-3 right-3 bg-black/70 text-white">
        {category}
      </Badge>
      {/* GuruBot trigger for article questions */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <GuruBotTriggerButton
          query={`Tell me more about ${title.toLowerCase()}. ${description}`}
          variant="ask"
          size="sm"
          className="h-8 w-8 p-0 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600"
        >
          <span className="sr-only">Ask about {title}</span>
        </GuruBotTriggerButton>
      </div>
    </div>
    <CardHeader>
      <CardTitle className="line-clamp-2 group-hover:text-orange-500 transition-colors">
        {title}
      </CardTitle>
      <CardDescription className="line-clamp-3">{description}</CardDescription>
    </CardHeader>
  </Card>
);

const GuideCard: FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  steps: number;
  difficulty: string;
  guruBotQuery: string;
}> = ({ title, description, icon, steps, difficulty, guruBotQuery }) => (
  <Card className="group hover:shadow-lg transition-all duration-300">
    <CardHeader>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-100 text-orange-500">
          {icon}
        </div>
        <div className="flex-1">
          <CardTitle className="group-hover:text-orange-500 transition-colors">
            {title}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {steps} steps
            </Badge>
            <Badge variant="outline" className="text-xs">
              {difficulty}
            </Badge>
          </div>
        </div>
      </div>
      <CardDescription className="mt-2">{description}</CardDescription>
    </CardHeader>
    <CardContent className="pt-0">
      <GuruBotTriggerButton
        query={guruBotQuery}
        className="w-full bg-orange-500 hover:bg-orange-600"
        variant="ask"
      >
        Start Guide
      </GuruBotTriggerButton>
    </CardContent>
  </Card>
);

export const ChooserTabs: FC = () => {
  return (
    <div className="container mx-auto w-full px-4">
      <Tabs defaultValue="mortgages" className="w-full">
        <TabsList className="justify-center w-full bg-transparent">
          <TabsTrigger
            value="mortgages"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-orange-500 rounded-none cursor-pointer"
          >
            Mortgages
          </TabsTrigger>
          <TabsTrigger
            value="credit-cards"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-orange-500 rounded-none cursor-pointer"
          >
            Credit Cards
          </TabsTrigger>
          <TabsTrigger
            value="personal-loans"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-orange-500 rounded-none cursor-pointer"
          >
            Personal Loans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mortgages" className="mt-8">
          <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Mortgage Insights & Guides
              </h3>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about home loans, interest rates,
                and property financing in Sri Lanka
              </p>
            </div>

            {/* Featured Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PostCard
                title="2025 Mortgage Interest Rates: Complete Guide for Sri Lankan Home Buyers"
                description="Discover the latest mortgage rates from all major banks in Sri Lanka. Compare fixed vs variable rates and find the best deal for your home purchase."
                image="/hero-images/1.jpg"
                readTime="8 min"
                category="Market Analysis"
                featured={true}
              />
              <PostCard
                title="First-Time Home Buyer's Complete Checklist"
                description="Step-by-step guide covering everything from credit score requirements to down payment strategies specifically for Sri Lankan property market."
                image="/hero-images/2.jpg"
                readTime="12 min"
                category="Buying Guide"
              />
              <PostCard
                title="Home Loan vs Personal Loan: Which is Better for Property Investment?"
                description="Comprehensive comparison of financing options for property investment, including tax implications and ROI calculations."
                image="/hero-images/3.jpg"
                readTime="6 min"
                category="Investment"
              />
            </div>

            {/* Quick Guides */}
            <div className="mt-12">
              <h4 className="text-xl font-semibold mb-6">Quick Start Guides</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GuideCard
                  title="Mortgage Pre-Approval Process"
                  description="Get pre-approved for your home loan in 5 simple steps"
                  icon={<Home className="size-5" />}
                  steps={5}
                  difficulty="Easy"
                  guruBotQuery="Guide me through the mortgage pre-approval process step by step. What documents do I need and how long does it take?"
                />
                <GuideCard
                  title="Calculate Your Affordability"
                  description="Use our tools to determine how much house you can afford"
                  icon={<Calculator className="size-5" />}
                  steps={3}
                  difficulty="Easy"
                  guruBotQuery="Help me calculate how much house I can afford. What factors should I consider for my home loan affordability?"
                />
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-600">4.5%</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Average Interest Rate
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">
                    25 Years
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Average Loan Term
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">15%</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Min Down Payment
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <GuruBotTriggerButton
                  query="Explain these mortgage statistics to me. What do these rates and terms mean for a first-time home buyer in Sri Lanka?"
                  variant="ask"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Ask About These Stats
                </GuruBotTriggerButton>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="credit-cards" className="mt-8">
          <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Credit Card Reviews & Comparisons
              </h3>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Find the perfect credit card with our detailed reviews,
                comparisons, and insider tips
              </p>
            </div>

            {/* Featured Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PostCard
                title="Best Cashback Credit Cards in Sri Lanka 2025"
                description="Comprehensive review of top cashback cards from Commercial Bank, HNB, Sampath Bank, and more. Maximize your daily spending rewards."
                image="/hero-images/4.jpg"
                readTime="10 min"
                category="Card Reviews"
                featured={true}
              />
              <PostCard
                title="Travel Credit Cards: Miles vs Points Comparison"
                description="Complete guide to airline miles and hotel points cards. Learn which travel rewards program offers the best value for Sri Lankan travelers."
                image="/hero-images/5.jpg"
                readTime="7 min"
                category="Travel"
              />
              <PostCard
                title="Credit Card Fees Breakdown: Hidden Costs to Avoid"
                description="Detailed analysis of annual fees, foreign transaction fees, and other charges. Learn how to minimize credit card costs."
                image="/hero-images/6.jpg"
                readTime="5 min"
                category="Education"
              />
            </div>

            {/* Quick Guides */}
            <div className="mt-12">
              <h4 className="text-xl font-semibold mb-6">Credit Card Guides</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GuideCard
                  title="Build Your Credit Score"
                  description="Proven strategies to improve your credit rating for better card approvals"
                  icon={<TrendingUp className="size-5" />}
                  steps={7}
                  difficulty="Medium"
                  guruBotQuery="Help me build and improve my credit score in Sri Lanka. What are the proven strategies for better credit card approvals?"
                />
                <GuideCard
                  title="Rewards Optimization"
                  description="Maximize your credit card rewards and cashback earnings"
                  icon={<Star className="size-5" />}
                  steps={4}
                  difficulty="Easy"
                  guruBotQuery="Show me how to maximize my credit card rewards and cashback earnings. What are the best strategies for reward optimization?"
                />
              </div>
            </div>

            {/* Comparison Tool Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-8">
              <div className="text-center space-y-4">
                <CreditCard className="size-12 text-blue-600 mx-auto" />
                <h4 className="text-xl font-semibold">
                  Compare 50+ Credit Cards
                </h4>
                <p className="text-gray-600 max-w-md mx-auto">
                  Use our advanced comparison tool to find cards that match your
                  spending patterns and financial goals.
                </p>
                <GuruBotTriggerButton
                  query="Help me compare credit cards and find the best one for my spending patterns and financial goals. What should I consider when choosing a credit card?"
                  className="bg-blue-600 hover:bg-blue-700"
                  variant="ask"
                >
                  Start Comparison
                </GuruBotTriggerButton>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="personal-loans" className="mt-8">
          <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Personal Loan Resources & Calculators
              </h3>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Smart borrowing starts here. Compare rates, calculate payments,
                and understand your options
              </p>
            </div>

            {/* Featured Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PostCard
                title="Personal Loan Interest Rates: Bank vs NBFI Comparison"
                description="Detailed comparison of personal loan rates from traditional banks versus Non-Bank Financial Institutions. Find the lowest rates available."
                image="/hero-images/1.jpg"
                readTime="9 min"
                category="Rate Analysis"
                featured={true}
              />
              <PostCard
                title="Debt Consolidation: When and How to Combine Your Loans"
                description="Learn when debt consolidation makes sense and how to execute it effectively. Includes real case studies from Sri Lankan borrowers."
                image="/hero-images/2.jpg"
                readTime="11 min"
                category="Strategy"
              />
              <PostCard
                title="Personal Loan Application: Documents and Requirements"
                description="Complete checklist of required documents and eligibility criteria for personal loans from major Sri Lankan financial institutions."
                image="/hero-images/3.jpg"
                readTime="6 min"
                category="Application Guide"
              />
            </div>

            {/* Calculator Tools */}
            <div className="mt-12">
              <h4 className="text-xl font-semibold mb-6">
                Loan Calculators & Tools
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GuideCard
                  title="Loan EMI Calculator"
                  description="Calculate your monthly payments for any loan amount and interest rate"
                  icon={<Calculator className="size-5" />}
                  steps={3}
                  difficulty="Easy"
                  guruBotQuery="Help me calculate my personal loan EMI. Guide me through the process of calculating monthly payments for different loan amounts and interest rates."
                />
                <GuideCard
                  title="Loan Eligibility Checker"
                  description="Check how much you can borrow based on your income and expenses"
                  icon={<Shield className="size-5" />}
                  steps={4}
                  difficulty="Easy"
                  guruBotQuery="Help me check my personal loan eligibility. How much can I borrow based on my income and what factors affect my loan approval?"
                />
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    12-18%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Interest Rate Range
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    5 Years
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Max Repayment Term
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">10x</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Income Multiple
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">24hrs</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Fastest Approval
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <GuruBotTriggerButton
                  query="Explain these personal loan market insights. What do these rates, terms, and approval times mean for someone looking for a personal loan in Sri Lanka?"
                  variant="ask"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Learn About Loan Market
                </GuruBotTriggerButton>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
