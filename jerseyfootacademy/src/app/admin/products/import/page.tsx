import Link from "next/link";
import { ImportForm } from "./import-form";

export const metadata = { title: "Admin · Import Products" };

export default function ImportProductsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Import Products (CSV)</h1>
      <p className="mb-6 text-sm text-navy/60">
        Bulk-create or update products. Pair this with the Export CSV button to round-trip your catalog.
      </p>
      <div className="rounded-xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
        <ImportForm />
      </div>
      <Link href="/admin/products" className="btn-outline mt-4 text-sm">Back to products</Link>
    </div>
  );
}
