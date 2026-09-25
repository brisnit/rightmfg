/** Dump the English translation source (content + Finder text + vocabulary guide) to JSON for translators. */
import { writeFileSync } from "node:fs";
import { englishContent } from "../lib/i18n/content";
import { englishFinder, FEATURE_TERMS } from "../lib/finder/finder-en";
import { capabilities } from "../data/capabilities";
import { materials } from "../data/materials";
import { markets } from "../data/markets";
import { partTypes, needs, rules, flags, tubeFormTerms, sheetFormTerms } from "../data/finder-knowledge";

const dir = "scripts/i18n-source";
writeFileSync(`${dir}/en-content.json`, JSON.stringify(englishContent(), null, 2));
writeFileSync(`${dir}/en-finder.json`, JSON.stringify(englishFinder(), null, 2));
const ruleTerms = Array.from(new Set([...rules.flatMap((r) => [...(r.all ?? []), ...(r.any ?? []), ...(r.none ?? [])]).filter((k) => k.startsWith("term:")).map((k) => k.slice(5)), ...Object.keys(FEATURE_TERMS)]));
writeFileSync(
  `${dir}/en-vocabulary.json`,
  JSON.stringify(
    {
      _readme: "English matching vocabulary. For each id, supply equivalent phrases in the target language (what a customer would actually type) in the finder file's *Terms / terms / termAliases fields.",
      capabilityKeywords: Object.fromEntries(capabilities.map((c) => [c.id, [...c.keywords, ...c.synonyms]])),
      materialKeywords: Object.fromEntries(materials.map((m) => [m.id, [...m.keywords, ...m.synonyms]])),
      marketKeywords: Object.fromEntries(markets.map((m) => [m.id, m.keywords])),
      partTypeTerms: Object.fromEntries(partTypes.map((p) => [p.id, p.terms])),
      needTerms: Object.fromEntries(needs.map((n) => [n.id, n.terms])),
      flagTerms: Object.fromEntries(flags.map((f) => [f.id, f.terms])),
      ruleAndFeatureTermsForTermAliases: ruleTerms,
      tubeFormTerms,
      sheetFormTerms,
    },
    null,
    2,
  ),
);
console.log("ok");
