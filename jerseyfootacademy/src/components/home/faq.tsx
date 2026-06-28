import { getLocale, getTranslations } from "next-intl/server";
import { getFaq } from "@/data/content";

export async function Faq() {
  const t = await getTranslations("home");
  const locale = await getLocale();
  const faqs = getFaq(locale);

  return (
    <section className="container-page py-16">
      <h2 className="mb-8 text-center font-display text-3xl font-extrabold">{t("faq")}</h2>
      <div className="mx-auto max-w-3xl divide-y divide-navy/10 rounded-xl bg-white shadow-soft ring-1 ring-navy/5">
        {faqs.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
              {f.q}
              <span className="text-gold transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-navy/70">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
