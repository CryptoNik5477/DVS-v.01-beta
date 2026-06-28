import type { Metadata } from "next";
import { Faq } from "@/components/home/faq";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about JerseyFootAcademy jerseys, shipping and returns.",
};

export default function FaqPage() {
  return (
    <div className="container-page pt-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/faq", label: "FAQ" }]} />
      <Faq />
    </div>
  );
}
