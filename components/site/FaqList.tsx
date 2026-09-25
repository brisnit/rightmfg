import type { Faq } from "@/data/types";
import { Plus } from "@/components/ui/Icons";

/** Native <details> accordion: accessible, no JS, crawlable. */
export function FaqList({ faqs, tone = "light" }: { faqs: Faq[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className={`border-t ${dark ? "border-white/15" : "border-navy/15"}`}>
      {faqs.map((f) => (
        <details key={f.q} className={`group border-b ${dark ? "border-white/15" : "border-navy/15"}`}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <span className={`heading text-lg sm:text-xl ${dark ? "text-white" : "text-navy"}`}>{f.q}</span>
            <Plus size={20} className={`mt-1 shrink-0 transition-transform duration-300 group-open:rotate-45 ${dark ? "text-blue-bright" : "text-blue"}`} />
          </summary>
          <p className={`max-w-3xl pb-6 leading-relaxed ${dark ? "text-white/75" : "text-steel"}`}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
