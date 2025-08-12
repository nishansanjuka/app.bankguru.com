"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  TrendingUp,
  PiggyBank,
  Home,
  CreditCard,
  Target,
  BarChart3,
  ArrowLeftRight,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

// Helper function for formatting currency in LKR
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Helper function for formatting percentage
const formatPercentage = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

// Result Display Component
function ResultDisplay({
  label,
  value,
  isPrimary = false,
}: {
  label: string;
  value: string;
  isPrimary?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-4">
      <span className="text-gray-600 text-sm font-medium">{label}</span>
      <span
        className={`font-bold ${
          isPrimary ? "text-2xl text-orange-500" : "text-lg text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// Input Field Component
function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "number",
}: {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-visible:ring-orange-500 border-0 bg-gray-50 rounded-xl h-12 text-base"
      />
    </div>
  );
}

// 1. Simple Interest Calculator
function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState<number | string>("");
  const [rate, setRate] = useState<number | string>("");
  const [time, setTime] = useState<number | string>("");

  const { interest, totalAmount } = useMemo(() => {
    const p = Number(principal);
    const r = Number(rate);
    const t = Number(time);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p < 0 || r < 0 || t < 0) {
      return { interest: 0, totalAmount: 0 };
    }

    const i = (p * r * t) / 100;
    const ta = p + i;
    return { interest: i, totalAmount: ta };
  }, [principal, rate, time]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InputField
          id="si-principal"
          label="Principal Amount (LKR)"
          value={principal}
          onChange={setPrincipal}
          placeholder="e.g., 100,000"
        />
        <InputField
          id="si-rate"
          label="Annual Interest Rate (%)"
          value={rate}
          onChange={setRate}
          placeholder="e.g., 12"
        />
        <InputField
          id="si-time"
          label="Time (Years)"
          value={time}
          onChange={setTime}
          placeholder="e.g., 3"
        />
      </div>
      <div className="bg-gray-50 rounded-2xl p-6 space-y-2">
        <ResultDisplay
          label="Interest Earned"
          value={formatCurrency(interest)}
        />
        <div className="border-t border-gray-200 pt-4">
          <ResultDisplay
            label="Total Amount"
            value={formatCurrency(totalAmount)}
            isPrimary
          />
        </div>
      </div>
    </div>
  );
}

// 2. Compound Interest Calculator
function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState<number | string>("");
  const [rate, setRate] = useState<number | string>("");
  const [time, setTime] = useState<number | string>("");
  const [compoundingFrequency, setCompoundingFrequency] = useState("12");

  const { futureValue, totalInterest } = useMemo(() => {
    const p = Number(principal);
    const r = Number(rate) / 100;
    const t = Number(time);
    const n = Number(compoundingFrequency);

    if (
      isNaN(p) ||
      isNaN(r) ||
      isNaN(t) ||
      isNaN(n) ||
      p < 0 ||
      r < 0 ||
      t < 0 ||
      n <= 0
    ) {
      return { futureValue: 0, totalInterest: 0 };
    }

    const fv = p * Math.pow(1 + r / n, n * t);
    const ti = fv - p;
    return { futureValue: fv, totalInterest: ti };
  }, [principal, rate, time, compoundingFrequency]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          id="ci-principal"
          label="Principal Amount (LKR)"
          value={principal}
          onChange={setPrincipal}
          placeholder="e.g., 100,000"
        />
        <InputField
          id="ci-rate"
          label="Annual Interest Rate (%)"
          value={rate}
          onChange={setRate}
          placeholder="e.g., 12"
        />
        <InputField
          id="ci-time"
          label="Time (Years)"
          value={time}
          onChange={setTime}
          placeholder="e.g., 10"
        />
        <div className="space-y-3">
          <Label
            htmlFor="ci-frequency"
            className="text-sm font-medium text-gray-700"
          >
            Compounding Frequency
          </Label>
          <Select
            value={compoundingFrequency}
            onValueChange={setCompoundingFrequency}
          >
            <SelectTrigger
              id="ci-frequency"
              className="focus-visible:ring-orange-500 border-0 bg-gray-50 rounded-xl h-12"
            >
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Annually</SelectItem>
              <SelectItem value="2">Semi-Annually</SelectItem>
              <SelectItem value="4">Quarterly</SelectItem>
              <SelectItem value="12">Monthly</SelectItem>
              <SelectItem value="365">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="bg-gray-50 rounded-2xl p-6 space-y-2">
        <ResultDisplay
          label="Total Interest"
          value={formatCurrency(totalInterest)}
        />
        <div className="border-t border-gray-200 pt-4">
          <ResultDisplay
            label="Future Value"
            value={formatCurrency(futureValue)}
            isPrimary
          />
        </div>
      </div>
    </div>
  );
}

// 3. Loan Payment Calculator (EMI)
function LoanPaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState<number | string>("");
  const [annualRate, setAnnualRate] = useState<number | string>("");
  const [loanTerm, setLoanTerm] = useState<number | string>("");

  const { monthlyPayment, totalPayment, totalInterest } = useMemo(() => {
    const p = Number(loanAmount);
    const r = Number(annualRate) / 100 / 12;
    const n = Number(loanTerm) * 12;

    if (isNaN(p) || isNaN(r) || isNaN(n) || p < 0 || r < 0 || n <= 0) {
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
    }

    let mp = 0;
    if (r === 0) {
      mp = p / n;
    } else {
      mp = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const tp = mp * n;
    const ti = tp - p;
    return { monthlyPayment: mp, totalPayment: tp, totalInterest: ti };
  }, [loanAmount, annualRate, loanTerm]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          id="loan-amount"
          label="Loan Amount (LKR)"
          value={loanAmount}
          onChange={setLoanAmount}
          placeholder="e.g., 5,000,000"
        />
        <InputField
          id="loan-rate"
          label="Annual Interest Rate (%)"
          value={annualRate}
          onChange={setAnnualRate}
          placeholder="e.g., 15"
        />
        <InputField
          id="loan-term"
          label="Loan Term (Years)"
          value={loanTerm}
          onChange={setLoanTerm}
          placeholder="e.g., 20"
        />
      </div>
      <div className="bg-gray-50 rounded-2xl p-6 space-y-2">
        <div className="border-b border-gray-200 pb-4">
          <ResultDisplay
            label="Monthly Payment"
            value={formatCurrency(monthlyPayment)}
            isPrimary
          />
        </div>
        <ResultDisplay
          label="Total Payment"
          value={formatCurrency(totalPayment)}
        />
        <ResultDisplay
          label="Total Interest Paid"
          value={formatCurrency(totalInterest)}
        />
      </div>
    </div>
  );
}

// 4. Savings Goal Calculator
function SavingsGoalCalculator() {
  const [currentSavings, setCurrentSavings] = useState<number | string>("");
  const [monthlyContribution, setMonthlyContribution] = useState<
    number | string
  >("");
  const [annualRate, setAnnualRate] = useState<number | string>("");
  const [targetAmount, setTargetAmount] = useState<number | string>("");

  const yearsToReachGoal = useMemo(() => {
    const cs = Number(currentSavings);
    const mc = Number(monthlyContribution);
    const ar = Number(annualRate) / 100;
    const ta = Number(targetAmount);

    if (
      isNaN(cs) ||
      isNaN(mc) ||
      isNaN(ar) ||
      isNaN(ta) ||
      cs < 0 ||
      mc < 0 ||
      ar < 0 ||
      ta < 0
    ) {
      return 0;
    }

    if (ta <= cs) return 0;

    if (mc === 0 && ar === 0) return Number.POSITIVE_INFINITY;

    let months = 0;
    let currentBalance = cs;
    const monthlyRate = ar / 12;

    while (currentBalance < ta && months < 12000) {
      currentBalance = currentBalance * (1 + monthlyRate) + mc;
      months++;
    }

    if (months >= 12000) return Number.POSITIVE_INFINITY;

    return months / 12;
  }, [currentSavings, monthlyContribution, annualRate, targetAmount]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          id="sg-current-savings"
          label="Current Savings (LKR)"
          value={currentSavings}
          onChange={setCurrentSavings}
          placeholder="e.g., 500,000"
        />
        <InputField
          id="sg-monthly-contribution"
          label="Monthly Contribution (LKR)"
          value={monthlyContribution}
          onChange={setMonthlyContribution}
          placeholder="e.g., 25,000"
        />
        <InputField
          id="sg-annual-rate"
          label="Annual Interest Rate (%)"
          value={annualRate}
          onChange={setAnnualRate}
          placeholder="e.g., 8"
        />
        <InputField
          id="sg-target-amount"
          label="Target Amount (LKR)"
          value={targetAmount}
          onChange={setTargetAmount}
          placeholder="e.g., 2,000,000"
        />
      </div>
      <div className="bg-gray-50 rounded-2xl p-6">
        <ResultDisplay
          label="Years to Reach Goal"
          value={
            yearsToReachGoal === Number.POSITIVE_INFINITY
              ? "Too long / Unreachable"
              : `${yearsToReachGoal.toFixed(1)} years`
          }
          isPrimary
        />
      </div>
    </div>
  );
}

// 5. Retirement Savings Calculator
function RetirementSavingsCalculator() {
  const [currentAge, setCurrentAge] = useState<number | string>("");
  const [retirementAge, setRetirementAge] = useState<number | string>("");
  const [currentSavings, setCurrentSavings] = useState<number | string>("");
  const [annualContribution, setAnnualContribution] = useState<number | string>(
    ""
  );
  const [annualRate, setAnnualRate] = useState<number | string>("");

  const retirementCorpus = useMemo(() => {
    const ca = Number(currentAge);
    const ra = Number(retirementAge);
    const cs = Number(currentSavings);
    const ac = Number(annualContribution);
    const ar = Number(annualRate) / 100;

    if (
      isNaN(ca) ||
      isNaN(ra) ||
      isNaN(cs) ||
      isNaN(ac) ||
      isNaN(ar) ||
      ca < 0 ||
      ra < 0 ||
      cs < 0 ||
      ac < 0 ||
      ar < 0 ||
      ra <= ca
    ) {
      return 0;
    }

    const yearsToRetirement = ra - ca;
    const monthlyRate = ar / 12;
    const monthlyContribution = ac / 12;

    let futureValue = cs;
    for (let i = 0; i < yearsToRetirement * 12; i++) {
      futureValue = futureValue * (1 + monthlyRate) + monthlyContribution;
    }

    return futureValue;
  }, [
    currentAge,
    retirementAge,
    currentSavings,
    annualContribution,
    annualRate,
  ]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InputField
          id="rs-current-age"
          label="Current Age"
          value={currentAge}
          onChange={setCurrentAge}
          placeholder="e.g., 30"
        />
        <InputField
          id="rs-retirement-age"
          label="Retirement Age"
          value={retirementAge}
          onChange={setRetirementAge}
          placeholder="e.g., 60"
        />
        <InputField
          id="rs-current-savings"
          label="Current Retirement Savings (LKR)"
          value={currentSavings}
          onChange={setCurrentSavings}
          placeholder="e.g., 1,000,000"
        />
        <InputField
          id="rs-annual-contribution"
          label="Annual Contribution (LKR)"
          value={annualContribution}
          onChange={setAnnualContribution}
          placeholder="e.g., 300,000"
        />
        <InputField
          id="rs-annual-rate"
          label="Annual Investment Return Rate (%)"
          value={annualRate}
          onChange={setAnnualRate}
          placeholder="e.g., 10"
        />
      </div>
      <div className="bg-gray-50 rounded-2xl p-6">
        <ResultDisplay
          label="Estimated Retirement Corpus"
          value={formatCurrency(retirementCorpus)}
          isPrimary
        />
      </div>
    </div>
  );
}

// 6. Mortgage Calculator
function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState<number | string>("");
  const [annualRate, setAnnualRate] = useState<number | string>("");
  const [loanTerm, setLoanTerm] = useState<number | string>("");

  const { monthlyPayment, totalPayment, totalInterest } = useMemo(() => {
    const p = Number(loanAmount);
    const r = Number(annualRate) / 100 / 12;
    const n = Number(loanTerm) * 12;

    if (isNaN(p) || isNaN(r) || isNaN(n) || p < 0 || r < 0 || n <= 0) {
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
    }

    let mp = 0;
    if (r === 0) {
      mp = p / n;
    } else {
      mp = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const tp = mp * n;
    const ti = tp - p;
    return { monthlyPayment: mp, totalPayment: tp, totalInterest: ti };
  }, [loanAmount, annualRate, loanTerm]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          id="mortgage-amount"
          label="Mortgage Amount (LKR)"
          value={loanAmount}
          onChange={setLoanAmount}
          placeholder="e.g., 15,000,000"
        />
        <InputField
          id="mortgage-rate"
          label="Annual Interest Rate (%)"
          value={annualRate}
          onChange={setAnnualRate}
          placeholder="e.g., 12"
        />
        <InputField
          id="mortgage-term"
          label="Loan Term (Years)"
          value={loanTerm}
          onChange={setLoanTerm}
          placeholder="e.g., 25"
        />
      </div>
      <div className="bg-gray-50 rounded-2xl p-6 space-y-2">
        <div className="border-b border-gray-200 pb-4">
          <ResultDisplay
            label="Monthly Payment"
            value={formatCurrency(monthlyPayment)}
            isPrimary
          />
        </div>
        <ResultDisplay
          label="Total Payment"
          value={formatCurrency(totalPayment)}
        />
        <ResultDisplay
          label="Total Interest Paid"
          value={formatCurrency(totalInterest)}
        />
      </div>
    </div>
  );
}

// 7. Debt Payoff Calculator
function DebtPayoffCalculator() {
  const [debtAmount, setDebtAmount] = useState<number | string>("");
  const [annualRate, setAnnualRate] = useState<number | string>("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | string>("");

  const { yearsToPayoff, totalInterestPaid } = useMemo(() => {
    let d = Number(debtAmount);
    const ar = Number(annualRate) / 100;
    const mp = Number(monthlyPayment);

    if (isNaN(d) || isNaN(ar) || isNaN(mp) || d < 0 || ar < 0 || mp <= 0) {
      return { yearsToPayoff: 0, totalInterestPaid: 0 };
    }

    if (mp * 12 < d * ar && ar > 0) {
      return {
        yearsToPayoff: Number.POSITIVE_INFINITY,
        totalInterestPaid: Number.POSITIVE_INFINITY,
      };
    }

    let months = 0;
    let totalInterest = 0;
    const monthlyRate = ar / 12;

    while (d > 0 && months < 12000) {
      const interestPayment = d * monthlyRate;
      const principalPayment = mp - interestPayment;

      if (principalPayment <= 0 && d > 0) {
        return {
          yearsToPayoff: Number.POSITIVE_INFINITY,
          totalInterestPaid: Number.POSITIVE_INFINITY,
        };
      }

      d -= principalPayment;
      totalInterest += interestPayment;
      months++;
    }

    if (months >= 12000 && d > 0) {
      return {
        yearsToPayoff: Number.POSITIVE_INFINITY,
        totalInterestPaid: Number.POSITIVE_INFINITY,
      };
    }

    return { yearsToPayoff: months / 12, totalInterestPaid: totalInterest };
  }, [debtAmount, annualRate, monthlyPayment]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          id="dp-debt-amount"
          label="Debt Amount (LKR)"
          value={debtAmount}
          onChange={setDebtAmount}
          placeholder="e.g., 750,000"
        />
        <InputField
          id="dp-annual-rate"
          label="Annual Interest Rate (%)"
          value={annualRate}
          onChange={setAnnualRate}
          placeholder="e.g., 24"
        />
        <InputField
          id="dp-monthly-payment"
          label="Monthly Payment (LKR)"
          value={monthlyPayment}
          onChange={setMonthlyPayment}
          placeholder="e.g., 35,000"
        />
      </div>
      <div className="bg-gray-50 rounded-2xl p-6 space-y-2">
        <div className="border-b border-gray-200 pb-4">
          <ResultDisplay
            label="Years to Payoff"
            value={
              yearsToPayoff === Number.POSITIVE_INFINITY
                ? "Too long / Unreachable"
                : `${yearsToPayoff.toFixed(1)} years`
            }
            isPrimary
          />
        </div>
        <ResultDisplay
          label="Total Interest Paid"
          value={
            totalInterestPaid === Number.POSITIVE_INFINITY
              ? "N/A"
              : formatCurrency(totalInterestPaid)
          }
        />
      </div>
    </div>
  );
}

// 8. Inflation Calculator
function InflationCalculator() {
  const [initialAmount, setInitialAmount] = useState<number | string>("");
  const [inflationRate, setInflationRate] = useState<number | string>("");
  const [years, setYears] = useState<number | string>("");

  const futureValue = useMemo(() => {
    const ia = Number(initialAmount);
    const ir = Number(inflationRate) / 100;
    const y = Number(years);

    if (isNaN(ia) || isNaN(ir) || isNaN(y) || ia < 0 || ir < 0 || y < 0) {
      return 0;
    }

    return ia * Math.pow(1 + ir, y);
  }, [initialAmount, inflationRate, years]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          id="inf-initial-amount"
          label="Initial Amount (LKR)"
          value={initialAmount}
          onChange={setInitialAmount}
          placeholder="e.g., 1,000,000"
        />
        <InputField
          id="inf-inflation-rate"
          label="Annual Inflation Rate (%)"
          value={inflationRate}
          onChange={setInflationRate}
          placeholder="e.g., 6"
        />
        <InputField
          id="inf-years"
          label="Number of Years"
          value={years}
          onChange={setYears}
          placeholder="e.g., 10"
        />
      </div>
      <div className="bg-gray-50 rounded-2xl p-6">
        <ResultDisplay
          label="Future Value (Adjusted for Inflation)"
          value={formatCurrency(futureValue)}
          isPrimary
        />
      </div>
    </div>
  );
}

// 9. Currency Converter
function CurrencyConverter() {
  const [amount, setAmount] = useState<number | string>("");
  const [fromCurrency, setFromCurrency] = useState("LKR");
  const [toCurrency, setToCurrency] = useState("USD");

  const exchangeRates: { [key: string]: { [key: string]: number } } = {
    LKR: { LKR: 1, USD: 0.0031, EUR: 0.0028, GBP: 0.0025, JPY: 0.48 },
    USD: { LKR: 325.0, USD: 1, EUR: 0.92, GBP: 0.8, JPY: 155.0 },
    EUR: { LKR: 353.0, USD: 1.08, EUR: 1, GBP: 0.87, JPY: 168.0 },
    GBP: { LKR: 406.0, USD: 1.25, EUR: 1.15, GBP: 1, JPY: 193.0 },
    JPY: { LKR: 2.08, USD: 0.0064, EUR: 0.0059, GBP: 0.0052, JPY: 1 },
  };

  const convertedAmount = useMemo(() => {
    const amt = Number(amount);
    if (isNaN(amt) || amt < 0) {
      return 0;
    }

    const rate = exchangeRates[fromCurrency]?.[toCurrency];
    if (!rate) {
      return 0;
    }
    return amt * rate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          id="cc-amount"
          label="Amount"
          value={amount}
          onChange={setAmount}
          placeholder="e.g., 100,000"
        />
        <div className="space-y-3">
          <Label
            htmlFor="cc-from"
            className="text-sm font-medium text-gray-700"
          >
            From Currency
          </Label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger
              id="cc-from"
              className="focus-visible:ring-orange-500 border-0 bg-gray-50 rounded-xl h-12"
            >
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(exchangeRates).map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <Label htmlFor="cc-to" className="text-sm font-medium text-gray-700">
            To Currency
          </Label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger
              id="cc-to"
              className="focus-visible:ring-orange-500 border-0 bg-gray-50 rounded-xl h-12"
            >
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(exchangeRates).map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="bg-gray-50 rounded-2xl p-6">
        <ResultDisplay
          label="Converted Amount"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: toCurrency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(convertedAmount)}
          isPrimary
        />
      </div>
    </div>
  );
}

// 10. Investment Return Calculator
function InvestmentReturnCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number | string>(
    ""
  );
  const [finalValue, setFinalValue] = useState<number | string>("");
  const [years, setYears] = useState<number | string>("");

  const annualizedReturn = useMemo(() => {
    const ii = Number(initialInvestment);
    const fv = Number(finalValue);
    const y = Number(years);

    if (isNaN(ii) || isNaN(fv) || isNaN(y) || ii <= 0 || fv < 0 || y <= 0) {
      return 0;
    }

    const cagr = Math.pow(fv / ii, 1 / y) - 1;
    return cagr * 100;
  }, [initialInvestment, finalValue, years]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          id="ir-initial-investment"
          label="Initial Investment (LKR)"
          value={initialInvestment}
          onChange={setInitialInvestment}
          placeholder="e.g., 500,000"
        />
        <InputField
          id="ir-final-value"
          label="Final Value (LKR)"
          value={finalValue}
          onChange={setFinalValue}
          placeholder="e.g., 800,000"
        />
        <InputField
          id="ir-years"
          label="Number of Years"
          value={years}
          onChange={setYears}
          placeholder="e.g., 5"
        />
      </div>
      <div className="bg-gray-50 rounded-2xl p-6">
        <ResultDisplay
          label="Annualized Return"
          value={formatPercentage(annualizedReturn)}
          isPrimary
        />
      </div>
    </div>
  );
}

const calculators = [
  {
    id: "simple-interest",
    title: "Simple Interest",
    icon: Calculator,
    component: <SimpleInterestCalculator />,
    description: "Calculate simple interest on your principal amount",
  },
  {
    id: "compound-interest",
    title: "Compound Interest",
    icon: TrendingUp,
    component: <CompoundInterestCalculator />,
    description: "See how your money grows with compound interest",
  },
  {
    id: "loan-payment",
    title: "Loan Payment (EMI)",
    icon: CreditCard,
    component: <LoanPaymentCalculator />,
    description: "Calculate your monthly loan payments",
  },
  {
    id: "savings-goal",
    title: "Savings Goal",
    icon: Target,
    component: <SavingsGoalCalculator />,
    description: "Plan how long it takes to reach your savings goal",
  },
  {
    id: "retirement-savings",
    title: "Retirement Savings",
    icon: PiggyBank,
    component: <RetirementSavingsCalculator />,
    description: "Estimate your retirement corpus",
  },
  {
    id: "mortgage",
    title: "Mortgage",
    icon: Home,
    component: <MortgageCalculator />,
    description: "Calculate your home mortgage payments",
  },
  {
    id: "debt-payoff",
    title: "Debt Payoff",
    icon: CreditCard,
    component: <DebtPayoffCalculator />,
    description: "Plan your debt repayment strategy",
  },
  {
    id: "inflation",
    title: "Inflation",
    icon: TrendingUp,
    component: <InflationCalculator />,
    description: "Understand inflation's impact on your money",
  },
  {
    id: "currency-converter",
    title: "Currency Converter",
    icon: ArrowLeftRight,
    component: <CurrencyConverter />,
    description: "Convert between different currencies",
  },
  {
    id: "investment-return",
    title: "Investment Return",
    icon: BarChart3,
    component: <InvestmentReturnCalculator />,
    description: "Calculate your investment returns (CAGR)",
  },
];

// Extract calculator IDs as a union type
export type CalculatorType = (typeof calculators)[number]["id"];


export default function FinancialCalculators({
  type,
}: {
  type?: CalculatorType;
}) {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>(
    type || "simple-interest"
  );

  useEffect(() => {
    if (type) {
      setActiveCalculator(type);
    }
  }, [type]);

  const activeCalc = calculators.find((calc) => calc.id === activeCalculator);

  return (
    <div className=" bg-white mt-20 pt-10">
      {/* Header */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Financial Calculators
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional financial tools to help you make informed decisions
            about your money in Sri Lankan Rupees (LKR).
          </p>
        </div>
      </div>

      <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Sidebar - Calculator Chooser */}
          <ScrollArea className="lg:col-span-4">
            <div className="w-full">
              <div className="sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Choose Calculator
                </h2>
                <div className="space-y-3 grid sm:grid-cols-2 gap-4">
                  {calculators.map((calc) => (
                    <button
                      key={calc.id}
                      onClick={() => setActiveCalculator(calc.id)}
                      className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
                        activeCalculator === calc.id
                          ? "bg-orange-500 text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <calc.icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold sm:text-base mb-1">
                            {calc.title}
                          </div>
                          <p
                            className={`text-sm leading-relaxed ${
                              activeCalculator === calc.id
                                ? "text-orange-100"
                                : "text-gray-500"
                            }`}
                          >
                            {calc.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Right Side - Calculator Content */}
          {activeCalc && (
            <>
              <div className="lg:col-span-8">
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-orange-500 text-white rounded-2xl">
                      <activeCalc.icon size={28} />
                    </div>
                    <div>
                      <h2 className=" text-lg sm:text-3xl font-bold text-gray-900">
                        {activeCalc.title}
                      </h2>
                      <p className="text-lg text-gray-600 mt-1">
                        {activeCalc.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white">{activeCalc.component}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
