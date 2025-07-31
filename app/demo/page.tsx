"use client"

import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"

// Use your actual product structure
const sampleProducts = [
  // Banking Services
  {
    id: "1",
    name: "Premier Checking Account",
    slug: "premier-checking-account",
    details: {
      fees: "No monthly fees",
      terms: "No minimum balance required",
      description: "Full-featured checking account with unlimited transactions and nationwide ATM access.",
      eligibility: "18+ with valid ID",
      additionalInfo: [
        {
          id: "1",
          type: "percentage",
          label: "APY",
          title: "Annual Percentage Yield",
          value: "0.25",
          description: "Interest rate",
        },
        {
          id: "2",
          type: "number",
          label: "ATM Fee Reimbursement",
          title: "Monthly ATM Reimbursement",
          value: "15",
          description: "ATM fees covered",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Checking+Account",
          description: "",
        },
      ],
    },
    isFeatured: true,
    isActive: true,
    institution: {
      id: "inst1",
      name: "First National Bank",
      logoUrl: null,
      licenseNumber: "FNB001",
      countryCode: "US",
    },
    productType: {
      code: "CHECKING_ACCOUNT",
      name: "Checking Account",
      description: "Daily banking account",
      category: { name: "Banking Services", slug: "banking-services" },
    },
    tags: [],
  },
  {
    id: "2",
    name: "High-Yield Savings",
    slug: "high-yield-savings",
    details: {
      fees: "No fees",
      terms: "$500 minimum to open",
      description: "Competitive interest rates with FDIC insurance and easy online access.",
      eligibility: "18+ US residents",
      additionalInfo: [
        {
          id: "1",
          type: "percentage",
          label: "APY",
          title: "Annual Percentage Yield",
          value: "4.50",
          description: "Current rate",
        },
        {
          id: "2",
          type: "number",
          label: "Minimum Balance",
          title: "Required Minimum",
          value: "500",
          description: "Opening deposit",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Savings+Account",
          description: "",
        },
      ],
    },
    isFeatured: true,
    isActive: true,
    institution: {
      id: "inst2",
      name: "Digital Savings Bank",
      logoUrl: null,
      licenseNumber: "DSB002",
      countryCode: "US",
    },
    productType: {
      code: "SAVINGS_ACCOUNT",
      name: "Savings Account",
      description: "Interest-bearing savings",
      category: { name: "Banking Services", slug: "banking-services" },
    },
    tags: [],
  },
  {
    id: "3",
    name: "12-Month Certificate of Deposit",
    slug: "12-month-cd",
    details: {
      fees: "No fees",
      terms: "12-month term, early withdrawal penalties apply",
      description: "Fixed-rate CD with guaranteed returns and FDIC insurance protection.",
      eligibility: "18+ with $1,000 minimum",
      additionalInfo: [
        {
          id: "1",
          type: "percentage",
          label: "APY",
          title: "Annual Percentage Yield",
          value: "5.25",
          description: "Fixed rate",
        },
        {
          id: "2",
          type: "number",
          label: "Minimum Deposit",
          title: "Required Minimum",
          value: "1000",
          description: "Opening amount",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Certificate+of+Deposit",
          description: "",
        },
      ],
    },
    isFeatured: false,
    isActive: true,
    institution: {
      id: "inst3",
      name: "Community Credit Union",
      logoUrl: null,
      licenseNumber: "CCU003",
      countryCode: "US",
    },
    productType: {
      code: "CERTIFICATE_DEPOSIT",
      name: "Certificate of Deposit",
      description: "Fixed-term deposit",
      category: { name: "Banking Services", slug: "banking-services" },
    },
    tags: [],
  },

  // Credit Products
  {
    id: "4",
    name: "Platinum Rewards Credit Card",
    slug: "platinum-rewards-credit-card",
    details: {
      fees: "No annual fee",
      terms: "Standard credit terms apply",
      description: "Earn 2% cash back on all purchases with no annual fee and comprehensive fraud protection.",
      eligibility: "Good to excellent credit required",
      additionalInfo: [
        {
          id: "1",
          type: "percentage",
          label: "APR",
          title: "Annual Percentage Rate",
          value: "16.99",
          description: "Variable APR",
        },
        {
          id: "2",
          type: "number",
          label: "Credit Limit",
          title: "Maximum Credit Limit",
          value: "25000",
          description: "Up to $25,000",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Credit+Card",
          description: "",
        },
      ],
    },
    isFeatured: true,
    isActive: true,
    institution: {
      id: "inst4",
      name: "Premier Credit Bank",
      logoUrl: null,
      licenseNumber: "PCB004",
      countryCode: "US",
    },
    productType: {
      code: "CREDIT_CARD",
      name: "Credit Card",
      description: "Revolving credit line",
      category: { name: "Credit Products", slug: "credit-products" },
    },
    tags: [],
  },
  {
    id: "5",
    name: "Personal Loan Express",
    slug: "personal-loan-express",
    details: {
      fees: "2.5% origination fee",
      terms: "2-7 years repayment terms",
      description: "Quick approval personal loans with competitive rates for debt consolidation or major purchases.",
      eligibility: "21+ with stable income",
      additionalInfo: [
        {
          id: "1",
          type: "percentage",
          label: "Interest Rate",
          title: "Annual Interest Rate",
          value: "8.99",
          description: "Starting from 8.99% APR",
        },
        {
          id: "2",
          type: "number",
          label: "Maximum Amount",
          title: "Loan Amount",
          value: "50000",
          description: "Up to $50,000",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Personal+Loan",
          description: "",
        },
      ],
    },
    isFeatured: false,
    isActive: true,
    institution: { id: "inst5", name: "QuickLend Financial", logoUrl: null, licenseNumber: "QL005", countryCode: "US" },
    productType: {
      code: "PERSONAL_LOAN",
      name: "Personal Loan",
      description: "Unsecured personal lending",
      category: { name: "Lending Products", slug: "lending-products" },
    },
    tags: [],
  },
  {
    id: "6",
    name: "Auto Loan Plus",
    slug: "auto-loan-plus",
    details: {
      fees: "No application fees",
      terms: "12-84 months financing available",
      description: "Competitive auto financing for new and used vehicles with flexible terms.",
      eligibility: "18+ with proof of income",
      additionalInfo: [
        {
          id: "1",
          type: "percentage",
          label: "Interest Rate",
          title: "Annual Interest Rate",
          value: "5.49",
          description: "Starting rate for qualified buyers",
        },
        {
          id: "2",
          type: "number",
          label: "Maximum Amount",
          title: "Loan Amount",
          value: "75000",
          description: "Up to $75,000",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Auto+Loan",
          description: "",
        },
      ],
    },
    isFeatured: true,
    isActive: true,
    institution: { id: "inst6", name: "Auto Finance Corp", logoUrl: null, licenseNumber: "AFC006", countryCode: "US" },
    productType: {
      code: "AUTO_LOAN",
      name: "Auto Loan",
      description: "Vehicle financing",
      category: { name: "Lending Products", slug: "lending-products" },
    },
    tags: [],
  },
  {
    id: "7",
    name: "Home Mortgage 30-Year Fixed",
    slug: "home-mortgage-30-year",
    details: {
      fees: "Standard closing costs apply",
      terms: "30-year fixed rate mortgage",
      description: "Traditional 30-year fixed-rate mortgage with competitive rates and flexible down payment options.",
      eligibility: "Qualified borrowers with down payment",
      additionalInfo: [
        {
          id: "1",
          type: "percentage",
          label: "Interest Rate",
          title: "Annual Interest Rate",
          value: "6.75",
          description: "Current rate",
        },
        {
          id: "2",
          type: "number",
          label: "Maximum Amount",
          title: "Loan Amount",
          value: "750000",
          description: "Up to $750,000",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Home+Mortgage",
          description: "",
        },
      ],
    },
    isFeatured: true,
    isActive: true,
    institution: {
      id: "inst7",
      name: "Home Lending Solutions",
      logoUrl: null,
      licenseNumber: "HLS007",
      countryCode: "US",
    },
    productType: {
      code: "HOME_MORTGAGE",
      name: "Home Mortgage",
      description: "Residential mortgage lending",
      category: { name: "Lending Products", slug: "lending-products" },
    },
    tags: [],
  },

  // Investment Services
  {
    id: "8",
    name: "Growth Investment Portfolio",
    slug: "growth-investment-portfolio",
    details: {
      fees: "0.75% management fee",
      terms: "Long-term investment recommended",
      description: "Diversified portfolio focused on growth stocks and emerging markets for wealth building.",
      eligibility: "Minimum $1,000 investment",
      additionalInfo: [
        {
          id: "1",
          type: "percentage",
          label: "Expected Return",
          title: "Historical Average Return",
          value: "12.4",
          description: "5-year average",
        },
        {
          id: "2",
          type: "number",
          label: "Minimum Investment",
          title: "Initial Investment",
          value: "1000",
          description: "Starting amount",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Investment+Portfolio",
          description: "",
        },
      ],
    },
    isFeatured: true,
    isActive: true,
    institution: {
      id: "inst8",
      name: "WealthBuilder Investments",
      logoUrl: null,
      licenseNumber: "WB008",
      countryCode: "US",
    },
    productType: {
      code: "INVESTMENT_PORTFOLIO",
      name: "Investment Portfolio",
      description: "Managed investment portfolios",
      category: { name: "Investment Services", slug: "investment-services" },
    },
    tags: [],
  },
  {
    id: "9",
    name: "Traditional IRA",
    slug: "traditional-ira",
    details: {
      fees: "No account fees",
      terms: "Tax-deferred retirement savings",
      description: "Tax-advantaged retirement account with flexible investment options and potential tax deductions.",
      eligibility: "Under age 70½ with earned income",
      additionalInfo: [
        {
          id: "1",
          type: "number",
          label: "Annual Contribution Limit",
          title: "Maximum Annual Contribution",
          value: "6500",
          description: "2024 limit",
        },
        {
          id: "2",
          type: "percentage",
          label: "Expected Return",
          title: "Historical Average Return",
          value: "8.5",
          description: "Long-term average",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=IRA+Account",
          description: "",
        },
      ],
    },
    isFeatured: false,
    isActive: true,
    institution: {
      id: "inst9",
      name: "Retirement Planning Inc",
      logoUrl: null,
      licenseNumber: "RPI009",
      countryCode: "US",
    },
    productType: {
      code: "RETIREMENT_ACCOUNT",
      name: "Retirement Account",
      description: "Tax-advantaged retirement savings",
      category: { name: "Investment Services", slug: "investment-services" },
    },
    tags: [],
  },

  // Insurance Products
  {
    id: "10",
    name: "Comprehensive Health Insurance",
    slug: "comprehensive-health-insurance",
    details: {
      fees: "$0 deductible option available",
      terms: "Annual policy with monthly payments",
      description: "Complete health coverage with nationwide network and preventive care benefits.",
      eligibility: "All ages welcome",
      additionalInfo: [
        {
          id: "1",
          type: "number",
          label: "Monthly Premium",
          title: "Premium Cost",
          value: "285",
          description: "Starting premium",
        },
        {
          id: "2",
          type: "number",
          label: "Coverage Limit",
          title: "Maximum Coverage",
          value: "1000000",
          description: "Annual limit",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Health+Insurance",
          description: "",
        },
      ],
    },
    isFeatured: false,
    isActive: true,
    institution: {
      id: "inst10",
      name: "HealthGuard Insurance",
      logoUrl: null,
      licenseNumber: "HG010",
      countryCode: "US",
    },
    productType: {
      code: "HEALTH_INSURANCE",
      name: "Health Insurance",
      description: "Medical coverage",
      category: { name: "Insurance Products", slug: "insurance-products" },
    },
    tags: [],
  },
  {
    id: "11",
    name: "Term Life Insurance",
    slug: "term-life-insurance",
    details: {
      fees: "No application fees",
      terms: "10, 20, or 30-year terms available",
      description: "Affordable term life insurance with guaranteed level premiums and death benefit protection.",
      eligibility: "Ages 18-65, health screening required",
      additionalInfo: [
        {
          id: "1",
          type: "number",
          label: "Coverage Amount",
          title: "Death Benefit",
          value: "500000",
          description: "Up to $500,000",
        },
        {
          id: "2",
          type: "number",
          label: "Monthly Premium",
          title: "Premium Cost",
          value: "45",
          description: "Starting at $45/month",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Life+Insurance",
          description: "",
        },
      ],
    },
    isFeatured: true,
    isActive: true,
    institution: {
      id: "inst11",
      name: "LifeSecure Insurance",
      logoUrl: null,
      licenseNumber: "LSI011",
      countryCode: "US",
    },
    productType: {
      code: "LIFE_INSURANCE",
      name: "Life Insurance",
      description: "Life insurance protection",
      category: { name: "Insurance Products", slug: "insurance-products" },
    },
    tags: [],
  },
  {
    id: "12",
    name: "Auto Insurance Plus",
    slug: "auto-insurance-plus",
    details: {
      fees: "No setup fees",
      terms: "6-month policy terms",
      description: "Comprehensive auto insurance with collision, liability, and roadside assistance coverage.",
      eligibility: "Valid driver's license required",
      additionalInfo: [
        {
          id: "1",
          type: "number",
          label: "Monthly Premium",
          title: "Premium Cost",
          value: "125",
          description: "Average monthly cost",
        },
        {
          id: "2",
          type: "number",
          label: "Deductible",
          title: "Collision Deductible",
          value: "500",
          description: "Standard deductible",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Auto+Insurance",
          description: "",
        },
      ],
    },
    isFeatured: false,
    isActive: true,
    institution: {
      id: "inst12",
      name: "AutoProtect Insurance",
      logoUrl: null,
      licenseNumber: "API012",
      countryCode: "US",
    },
    productType: {
      code: "AUTO_INSURANCE",
      name: "Auto Insurance",
      description: "Vehicle insurance coverage",
      category: { name: "Insurance Products", slug: "insurance-products" },
    },
    tags: [],
  },

  // Digital Services
  {
    id: "13",
    name: "Mobile Payment Wallet",
    slug: "mobile-payment-wallet",
    details: {
      fees: "Free to use",
      terms: "Standard digital wallet terms",
      description: "Secure mobile payments with instant transfers, bill pay, and rewards on every transaction.",
      eligibility: "Smartphone required",
      additionalInfo: [
        {
          id: "1",
          type: "number",
          label: "Daily Limit",
          title: "Transaction Limit",
          value: "5000",
          description: "Daily spending limit",
        },
        {
          id: "2",
          type: "text",
          label: "Transaction Fee",
          title: "Fee Structure",
          value: "Free",
          description: "No transaction fees",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Digital+Wallet",
          description: "",
        },
      ],
    },
    isFeatured: true,
    isActive: true,
    institution: { id: "inst13", name: "PayFast Digital", logoUrl: null, licenseNumber: "PF013", countryCode: "US" },
    productType: {
      code: "DIGITAL_WALLET",
      name: "Digital Wallet",
      description: "Mobile payment solution",
      category: { name: "Digital Services", slug: "digital-services" },
    },
    tags: [],
  },
  {
    id: "14",
    name: "Buy Now Pay Later",
    slug: "buy-now-pay-later",
    details: {
      fees: "No interest if paid in 4 payments",
      terms: "Pay in 4 equal installments",
      description: "Split purchases into 4 interest-free payments with automatic deductions every 2 weeks.",
      eligibility: "18+ with debit card",
      additionalInfo: [
        {
          id: "1",
          type: "number",
          label: "Maximum Purchase",
          title: "Purchase Limit",
          value: "2500",
          description: "Per transaction limit",
        },
        {
          id: "2",
          type: "percentage",
          label: "Late Fee",
          title: "Late Payment Fee",
          value: "0",
          description: "No late fees",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=BNPL+Service",
          description: "",
        },
      ],
    },
    isFeatured: true,
    isActive: true,
    institution: { id: "inst14", name: "FlexPay Solutions", logoUrl: null, licenseNumber: "FPS014", countryCode: "US" },
    productType: {
      code: "BNPL_SERVICE",
      name: "Buy Now Pay Later",
      description: "Installment payment service",
      category: { name: "Digital Services", slug: "digital-services" },
    },
    tags: [],
  },
  {
    id: "15",
    name: "Cryptocurrency Trading Platform",
    slug: "crypto-trading-platform",
    details: {
      fees: "0.5% trading fee",
      terms: "24/7 trading available",
      description:
        "Trade Bitcoin, Ethereum, and 50+ cryptocurrencies with advanced security and real-time market data.",
      eligibility: "18+ with identity verification",
      additionalInfo: [
        {
          id: "1",
          type: "percentage",
          label: "Trading Fee",
          title: "Transaction Fee",
          value: "0.5",
          description: "Per trade",
        },
        {
          id: "2",
          type: "number",
          label: "Minimum Trade",
          title: "Minimum Order",
          value: "10",
          description: "Minimum $10 trade",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Crypto+Trading",
          description: "",
        },
      ],
    },
    isFeatured: false,
    isActive: true,
    institution: {
      id: "inst15",
      name: "CryptoTrade Exchange",
      logoUrl: null,
      licenseNumber: "CTE015",
      countryCode: "US",
    },
    productType: {
      code: "CRYPTO_TRADING",
      name: "Cryptocurrency Trading",
      description: "Digital asset trading",
      category: { name: "Digital Services", slug: "digital-services" },
    },
    tags: [],
  },

  // Foreign Exchange & Remittance
  {
    id: "16",
    name: "International Wire Transfer",
    slug: "international-wire-transfer",
    details: {
      fees: "$15 per transfer",
      terms: "Same-day processing available",
      description: "Send money internationally with competitive exchange rates and secure transfer protocols.",
      eligibility: "Valid ID and recipient details required",
      additionalInfo: [
        {
          id: "1",
          type: "number",
          label: "Transfer Fee",
          title: "Service Fee",
          value: "15",
          description: "Per transfer",
        },
        {
          id: "2",
          type: "number",
          label: "Maximum Amount",
          title: "Transfer Limit",
          value: "50000",
          description: "Per transaction",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Wire+Transfer",
          description: "",
        },
      ],
    },
    isFeatured: false,
    isActive: true,
    institution: {
      id: "inst16",
      name: "Global Transfer Services",
      logoUrl: null,
      licenseNumber: "GTS016",
      countryCode: "US",
    },
    productType: {
      code: "WIRE_TRANSFER",
      name: "Wire Transfer",
      description: "International money transfer",
      category: { name: "Foreign Exchange", slug: "foreign-exchange" },
    },
    tags: [],
  },
  {
    id: "17",
    name: "Multi-Currency Account",
    slug: "multi-currency-account",
    details: {
      fees: "No monthly fees",
      terms: "Hold up to 10 currencies",
      description: "Hold, exchange, and manage multiple currencies in one account with competitive exchange rates.",
      eligibility: "International business or frequent travelers",
      additionalInfo: [
        {
          id: "1",
          type: "number",
          label: "Supported Currencies",
          title: "Currency Options",
          value: "10",
          description: "Major world currencies",
        },
        {
          id: "2",
          type: "percentage",
          label: "Exchange Margin",
          title: "FX Margin",
          value: "0.5",
          description: "Above mid-market rate",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Multi+Currency",
          description: "",
        },
      ],
    },
    isFeatured: true,
    isActive: true,
    institution: {
      id: "inst17",
      name: "International Banking Corp",
      logoUrl: null,
      licenseNumber: "IBC017",
      countryCode: "US",
    },
    productType: {
      code: "MULTI_CURRENCY_ACCOUNT",
      name: "Multi-Currency Account",
      description: "Multi-currency banking",
      category: { name: "Foreign Exchange", slug: "foreign-exchange" },
    },
    tags: [],
  },

  // Specialty Services
  {
    id: "18",
    name: "Safe Deposit Box",
    slug: "safe-deposit-box",
    details: {
      fees: "$50 annual fee",
      terms: "24/7 access with appointment",
      description: "Secure storage for important documents, jewelry, and valuables in our climate-controlled vault.",
      eligibility: "Bank customers with valid ID",
      additionalInfo: [
        {
          id: "1",
          type: "number",
          label: "Annual Fee",
          title: "Yearly Cost",
          value: "50",
          description: "Small box fee",
        },
        {
          id: "2",
          type: "text",
          label: "Box Size",
          title: "Dimensions",
          value: "3x5x24 inches",
          description: "Small box size",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Safe+Deposit+Box",
          description: "",
        },
      ],
    },
    isFeatured: false,
    isActive: true,
    institution: {
      id: "inst18",
      name: "Secure Vault Services",
      logoUrl: null,
      licenseNumber: "SVS018",
      countryCode: "US",
    },
    productType: {
      code: "SAFE_DEPOSIT_BOX",
      name: "Safe Deposit Box",
      description: "Secure storage service",
      category: { name: "Specialty Services", slug: "specialty-services" },
    },
    tags: [],
  },
  {
    id: "19",
    name: "Merchant Payment Processing",
    slug: "merchant-payment-processing",
    details: {
      fees: "2.9% + $0.30 per transaction",
      terms: "No setup fees or monthly minimums",
      description: "Accept credit cards, debit cards, and digital payments with next-day funding and fraud protection.",
      eligibility: "Registered business with tax ID",
      additionalInfo: [
        {
          id: "1",
          type: "percentage",
          label: "Processing Rate",
          title: "Transaction Rate",
          value: "2.9",
          description: "Plus $0.30 per transaction",
        },
        {
          id: "2",
          type: "text",
          label: "Settlement Time",
          title: "Funding Speed",
          value: "Next business day",
          description: "Fast funding",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Merchant+Services",
          description: "",
        },
      ],
    },
    isFeatured: true,
    isActive: true,
    institution: {
      id: "inst19",
      name: "Business Payment Solutions",
      logoUrl: null,
      licenseNumber: "BPS019",
      countryCode: "US",
    },
    productType: {
      code: "MERCHANT_SERVICES",
      name: "Merchant Services",
      description: "Payment processing for businesses",
      category: { name: "Specialty Services", slug: "specialty-services" },
    },
    tags: [],
  },
  {
    id: "20",
    name: "Trust & Estate Planning",
    slug: "trust-estate-planning",
    details: {
      fees: "0.75% of assets under management",
      terms: "Minimum $100,000 in assets",
      description: "Comprehensive trust and estate planning services with experienced fiduciary management.",
      eligibility: "High net worth individuals",
      additionalInfo: [
        {
          id: "1",
          type: "percentage",
          label: "Management Fee",
          title: "Annual Fee",
          value: "0.75",
          description: "Of assets under management",
        },
        {
          id: "2",
          type: "number",
          label: "Minimum Assets",
          title: "Account Minimum",
          value: "100000",
          description: "Required minimum",
        },
        {
          id: "3",
          type: "image",
          label: "Product Image",
          title: "",
          value: "/placeholder.svg?height=200&width=400&text=Trust+Services",
          description: "",
        },
      ],
    },
    isFeatured: false,
    isActive: true,
    institution: {
      id: "inst20",
      name: "Heritage Trust Company",
      logoUrl: null,
      licenseNumber: "HTC020",
      countryCode: "US",
    },
    productType: {
      code: "TRUST_SERVICES",
      name: "Trust Services",
      description: "Estate planning and trust management",
      category: { name: "Specialty Services", slug: "specialty-services" },
    },
    tags: [],
  },
]

export default function DemoPage() {
  const handleProductAction = (action: string, productId: string) => {
    console.log(`Action: ${action}, Product ID: ${productId}`)
    // Handle different actions here
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Financial Products <span className="font-semibold text-orange-500">Showcase</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
            Explore our comprehensive collection of financial product components designed for modern banking and fintech
            applications.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search products..." className="pl-10 w-64 h-12 rounded-2xl border-gray-200" />
            </div>
            <Button variant="outline" className="h-12 px-6 rounded-2xl bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="h-12 px-6 rounded-2xl bg-transparent">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-gray-600">
              {sampleProducts.length} Products
            </Badge>
            <Badge className="bg-orange-100 text-orange-700">
              {sampleProducts.filter((p) => p.isFeatured).length} Featured
            </Badge>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={sampleProducts} variant="default" onProductAction={handleProductAction} />
      </div>
    </div>
  )
}
