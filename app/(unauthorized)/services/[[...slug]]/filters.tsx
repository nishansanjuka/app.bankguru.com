"use client";

import DynamicFilterSheet from "@/components/shared/dynamic-filtering-sheet";
import { getProducts } from "@/lib/actions/products";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { FC, useCallback } from "react";

const Filters: FC<{
  catId: string;
  setFilteredData: (data: Product[]) => void;
}> = ({ catId, setFilteredData }) => {
  const handleFilter = useCallback(
    (filtered: Product[]) => {
      setFilteredData(filtered);
    },
    [setFilteredData]
  );

  const { data: loans } = useQuery({
    queryKey: ["loans", catId],
    queryFn: async () => {
      const res = await getProducts({
        categoryId: catId,
      });
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch loans");
      }
      return res.data;
    },
    enabled: !!catId,
  });

  return <DynamicFilterSheet data={loans ?? []} onFilter={handleFilter} />;
};

export { Filters };
