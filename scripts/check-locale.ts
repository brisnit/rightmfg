/**
 * Validate a locale against the English source: same keys, same array lengths,
 * same {placeholders}, no empty strings, and translated (not left in English).
 *   npx tsx scripts/check-locale.ts ar
 */
import { dict as enDict } from "../lib/i18n/locales/en/dict";
import { englishContent } from "../lib/i18n/content";
import { englishFinder } from "../lib/finder/finder-en";

const locale = process.argv[2];
if (!locale) throw new Error("usage: check-locale <ar|zh|nl>");

/** Paths that may legitimately stay identical to English (numbers, brand/equipment names, codes). */
const MAY_MATCH = /(^|\.)(capabilityTerms|materialTerms|marketTerms|termAliases|terms|match|stopPhrases|referential|questionWords|tubeFormTerms|sheetFormTerms)(\.|$)/;

const problems: string[] = [];
let strings = 0;
let identical = 0;

function placeholders(s: string) {
  return (s.match(/\{\w+\}/g) ?? []).sort().join(",");
}

function walk(en: unknown, tr: unknown, path: string) {
  if (typeof en === "string") {
    if (typeof tr !== "string") return problems.push(`${path}: expected string`);
    if (!tr.trim() && en.trim()) problems.push(`${path}: empty`);
    if (placeholders(en) !== placeholders(tr)) problems.push(`${path}: placeholders ${placeholders(en)} ≠ ${placeholders(tr)}`);
    strings++;
    if (en === tr && /[a-z]{4,}/.test(en) && !MAY_MATCH.test(path)) identical++;
    return;
  }
  if (Array.isArray(en)) {
    if (!Array.isArray(tr)) return problems.push(`${path}: expected array`);
    if (MAY_MATCH.test(path)) {
      if (tr.some((x) => typeof x !== "string" || !x.trim())) problems.push(`${path}: vocabulary must be non-empty strings`);
      return;
    }
    if (en.length !== tr.length) problems.push(`${path}: length ${tr.length} ≠ ${en.length}`);
    en.forEach((v, i) => walk(v, tr[i], `${path}[${i}]`));
    return;
  }
  if (en && typeof en === "object") {
    if (!tr || typeof tr !== "object") return problems.push(`${path}: expected object`);
    const trObj = tr as Record<string, unknown>;
    for (const k of Object.keys(en)) {
      if (!(k in trObj)) {
        if (path.endsWith("termAliases")) continue;
        problems.push(`${path}.${k}: missing`);
        continue;
      }
      walk((en as Record<string, unknown>)[k], trObj[k], `${path}.${k}`);
    }
    if (!path.endsWith("termAliases")) for (const k of Object.keys(trObj)) if (!(k in (en as object))) problems.push(`${path}.${k}: unexpected key`);
  }
}

async function main() {
  const load = async (f: string) => import(`../lib/i18n/locales/${locale}/${f}`);
  const { dict } = await load("dict");
  const { content } = await load("content");
  const { finder } = await load("finder");
  walk(enDict, dict, "dict");
  walk(englishContent(), content, "content");
  walk(englishFinder(), finder, "finder");

  // Vocabulary coverage: every Finder id should have at least one local term.
  const vocab = [
    ["capabilityTerms", finder.capabilityTerms],
    ["materialTerms", finder.materialTerms],
    ["marketTerms", finder.marketTerms],
  ] as const;
  for (const [name, rec] of vocab) for (const [id, arr] of Object.entries(rec as Record<string, string[]>)) if (!arr.length) problems.push(`finder.${name}.${id}: no local terms`);
  for (const [id, p] of Object.entries(finder.partTypes as Record<string, { terms: string[] }>)) if (!p.terms.length) problems.push(`finder.partTypes.${id}.terms: no local terms`);
  for (const [id, n] of Object.entries(finder.needs as Record<string, { terms: string[] }>)) if (!n.terms.length) problems.push(`finder.needs.${id}.terms: no local terms`);
  for (const [id, i] of Object.entries(finder.intents as Record<string, { match: string[] }>)) if (!i.match.length) problems.push(`finder.intents.${id}.match: no local triggers`);
  if (Object.keys(finder.termAliases).length < 20) problems.push(`finder.termAliases: only ${Object.keys(finder.termAliases).length} aliases`);

  console.log(`${locale}: ${strings} strings, ${identical} left identical to English`);
  if (problems.length) {
    console.log(problems.slice(0, 80).join("\n"));
    console.log(`✗ ${problems.length} problem(s)`);
    process.exit(1);
  }
  console.log("✓ structure OK");
}

main();
