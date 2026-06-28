"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-outline no-print text-sm">
      <Printer size={16} /> Print / Save PDF
    </button>
  );
}
