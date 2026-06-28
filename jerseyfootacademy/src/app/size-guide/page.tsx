import type { Metadata } from "next";
import { SizeGuide } from "@/components/product/size-guide";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = { title: "Size Guide" };

export default function SizeGuidePage() {
  return (
    <div className="container-page pt-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/size-guide", label: "Size Guide" }]} />
      <SizeGuide />
    </div>
  );
}
