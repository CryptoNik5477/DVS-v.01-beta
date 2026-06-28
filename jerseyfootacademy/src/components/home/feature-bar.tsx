import { getTranslations } from "next-intl/server";
import { Globe2, ShieldCheck, Shirt, Sparkles } from "lucide-react";

export async function FeatureBar() {
  const t = await getTranslations("features");
  const items = [
    { icon: Globe2, title: t("shipping"), text: t("shippingText") },
    { icon: ShieldCheck, title: t("secure"), text: t("secureText") },
    { icon: Shirt, title: t("custom"), text: t("customText") },
    { icon: Sparkles, title: t("quality"), text: t("qualityText") },
  ];
  return (
    <section className="border-y border-navy/5 bg-white">
      <div className="container-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="flex items-start gap-3">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-navy/5 text-navy">
              <it.icon size={20} />
            </span>
            <div>
              <p className="text-sm font-bold">{it.title}</p>
              <p className="text-xs text-navy/60">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
