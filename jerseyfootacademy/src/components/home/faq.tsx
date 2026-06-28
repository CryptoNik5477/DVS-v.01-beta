import { getTranslations } from "next-intl/server";

const FAQS = [
  {
    q: "How long does international shipping take?",
    a: "We ship worldwide from Thailand. Standard delivery takes 5–24 business days depending on your region; express options are available at checkout with full tracking.",
  },
  {
    q: "Can I add a player name and number?",
    a: "Yes! Every customizable jersey includes our flocking configurator — add any name, number, font and color with a live preview before you buy.",
  },
  {
    q: "What sizes do you offer?",
    a: "All jerseys are available from XS to XXL. Check the size guide on each product page for exact measurements.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept Visa, Mastercard, Apple Pay and Google Pay through our secure Stripe checkout. More methods are coming soon.",
  },
  {
    q: "What is your return policy?",
    a: "Unworn items in original condition can be returned within 14 days. Personalized (flocked) jerseys are final sale unless faulty.",
  },
];

export async function Faq() {
  const t = await getTranslations("home");
  return (
    <section className="container-page py-16">
      <h2 className="mb-8 text-center font-display text-3xl font-extrabold">{t("faq")}</h2>
      <div className="mx-auto max-w-3xl divide-y divide-navy/10 rounded-xl bg-white shadow-soft ring-1 ring-navy/5">
        {FAQS.map((f) => (
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
