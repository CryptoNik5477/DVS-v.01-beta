import { ScaffoldNotice } from "@/components/admin/scaffold-notice";

export const metadata = { title: "Admin · New Product" };

export default function AdminNewProductPage() {
  return (
    <ScaffoldNotice title="New Product">
      The product form (name, slug, description, prices, category, images, variants/stock, badges)
      maps directly to the <code>Product</code>, <code>ProductImage</code> and{" "}
      <code>ProductVariant</code> models. Add a server action that validates with Zod and calls{" "}
      <code>prisma.product.create</code>. Bulk creation is available via CSV import.
    </ScaffoldNotice>
  );
}
