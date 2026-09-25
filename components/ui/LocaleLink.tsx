"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { localizeHref } from "@/lib/i18n/config";
import { useI18n } from "@/components/i18n/I18nProvider";

/** Drop-in for next/link that keeps the visitor in their chosen language. */
export default function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const { locale } = useI18n();
  const h = typeof href === "string" ? localizeHref(locale, href) : href;
  return <NextLink href={h} {...rest} />;
}
