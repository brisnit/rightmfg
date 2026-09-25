import { runFinder } from "../lib/finder/engine";
import { getContent } from "../lib/i18n/registry";
import { isLocale } from "../lib/i18n/config";
import { finder as en } from "../lib/i18n/locales/en/finder";
import { finder as ar } from "../lib/i18n/locales/ar/finder";
import { finder as zh } from "../lib/i18n/locales/zh/finder";
import { finder as nl } from "../lib/i18n/locales/nl/finder";
import type { FinderContext } from "../lib/finder/types";
const args = process.argv.slice(2);
const locale = isLocale(args[0]) ? args.shift()! as "en" | "ar" | "zh" | "nl" : "en";
const k = { locale, content: getContent(locale), text: { en, ar, zh, nl }[locale] };
const qs = args;
let ctx: FinderContext | undefined;
for (const q of qs) {
  const r = runFinder({ query: q, context: ctx }, k);
  ctx = r.context;
  console.log("\n### " + q);
  console.log(`mode=${r.mode} coverage=${r.coverage ? r.coverage.percent + "% " + r.coverage.matched + "/" + r.coverage.total : "-"}`);
  console.log("summary:", r.summary);
  console.log("described:", r.described.map((e) => `${e.kind}:${e.label}(${e.term})${e.fromContext ? "*" : ""}`).join(" | "));
  for (const g of r.groups) console.log(`  [${g.label}] ` + g.items.map((i) => `${i.name}=${i.score}`).join(", "));
  console.log("  seq:", r.sequence.map((s) => s.name).join(" → "));
  if (r.flags.length) console.log("  flags:", r.flags.map((f) => f.level + ":" + f.term).join(", "));
  if (r.answer) console.log("  answer:", r.answer.title);
  console.log("  follow:", r.followUps.join(" / "));
}
