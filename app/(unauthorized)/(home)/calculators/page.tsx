import FinancialCalculators from "@/components/shared/calculators";

export default async function CalculatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ type: string | undefined }>;
}) {
  const { type } = await searchParams;
  return <FinancialCalculators type={type} />;
}
