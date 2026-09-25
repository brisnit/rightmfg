import { runFinder } from "../lib/finder/engine";
import type { FinderContext } from "../lib/finder/types";
const qs = process.argv.slice(2);
let ctx: FinderContext | undefined;
for (const q of qs) {
  const r = runFinder({ query: q, context: ctx });
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
