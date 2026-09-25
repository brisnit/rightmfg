"use client";

import { Button } from "@/components/ui/Button";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function NotFound() {
  const { dict } = useI18n();
  return (
    <section className="blueprint flex min-h-[80vh] items-end bg-ink pb-20 pt-40 text-white">
      <div className="container-x">
        <p className="label text-blue-bright">{dict.notFound.eyebrow}</p>
        <h1 className="display mt-4 text-[clamp(2.6rem,8vw,6rem)]">{dict.notFound.title}</h1>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/">{dict.notFound.home}</Button>
          <Button href="/capability-finder" variant="ghost-light">
            {dict.notFound.finder}
          </Button>
        </div>
      </div>
    </section>
  );
}
