"use client";

import DynamicFilterSheet from "@/components/shared/dynamic-filtering-sheet";
import { getProducts } from "@/lib/actions/products";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { FC, useCallback } from "react";

const Filters: FC<{
  setFilteredData: (data: Product[]) => void;
}> = ({ setFilteredData }) => {
  const handleFilter = useCallback(
    (filtered: Product[]) => {
      setFilteredData(filtered);
    },
    [setFilteredData]
  );

  const { data: loans } = useQuery({
    queryKey: ["loans"],
    queryFn: async () => {
      const res = await getProducts({});
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch loans");
      }
      return res.data;
    },
  });

  return <DynamicFilterSheet data={loans ?? []} onFilter={handleFilter} />;
};

export { Filters };
