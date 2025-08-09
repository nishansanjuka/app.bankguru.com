"use client";

import React from "react";
import { Markdown } from "./markdown";

interface ComparisonMessageProps {
  summary: string;
}

export function ComparisonMessage({ summary }: ComparisonMessageProps) {
  return (
    <div className="space-y-6">
      {/* AI Summary */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
        <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
          GuruBot Analysis
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          <Markdown>{summary}</Markdown>
        </p>
      </div>
    </div>
  );
}
