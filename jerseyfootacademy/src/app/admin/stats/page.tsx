import { ScaffoldNotice } from "@/components/admin/scaffold-notice";

export const metadata = { title: "Admin · Statistics" };

export default function AdminStatsPage() {
  return (
    <ScaffoldNotice title="Statistics">
      Revenue, conversion and best-seller charts will render here from aggregated <code>Order</code>
      {" "}data. The dashboard overview already computes paid revenue and order counts — extend with a
      charting library (e.g. Recharts) and time-range filters.
    </ScaffoldNotice>
  );
}
