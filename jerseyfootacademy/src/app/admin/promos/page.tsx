import { ScaffoldNotice } from "@/components/admin/scaffold-notice";

export const metadata = { title: "Admin · Promo Codes" };

export default function AdminPromosPage() {
  return (
    <ScaffoldNotice title="Promo Codes">
      Manage discount codes stored in the <code>PromoCode</code> table (percent or fixed, min order,
      usage limits, expiry). Demo codes for offline testing live in <code>src/config/promos.ts</code>
      {" "}(e.g. <strong>WELCOME10</strong>, <strong>WORLDCUP26</strong>). Wire create/edit forms to a
      server action to manage production codes here.
    </ScaffoldNotice>
  );
}
