/** Text normalization and phrase matching for the Capability Finder (Latin, Arabic, CJK). */

const SPECIAL = /[±]|\+\/-/;
const NON_LATIN = /[؀-ۿ㐀-鿿豈-﫿]/;

export function stem(word: string): string {
  if (!/^[a-z0-9]+$/.test(word)) return word;
  if (word.length > 4 && word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us")) return word.slice(0, -1);
  return word;
}

export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[’`]/g, "'")
    // Arabic: strip diacritics/tatweel, unify alef/yeh/teh-marbuta variants
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/aluminium/g, "aluminum")
    .replace(/(\d)\s*(?:-|\s)?\s*(hr|hrs|hour|hours)\b/g, "$1 hour")
    .replace(/[^\p{L}\p{N}'\s]/gu, " ")
    .replace(/'/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokens(norm: string): string[] {
  return norm.split(" ").filter(Boolean).map(stem);
}

export function stemPhrase(phrase: string): string {
  return tokens(normalize(phrase)).join(" ");
}

function levenshtein(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/**
 * A prepared piece of user text that phrases can be tested against.
 * Latin phrases match on word boundaries (with light stemming); Arabic and
 * Chinese phrases match as substrings. `mask` removes a phrase so that e.g.
 * "3d printing" doesn't also count as "3d" bending.
 */
export class Haystack {
  readonly raw: string;
  private text: string;
  private flat: string;
  private toks: string[];
  private rawToks: string[];

  constructor(raw: string) {
    this.raw = raw.toLowerCase();
    const n = normalize(raw);
    this.rawToks = n.split(" ").filter(Boolean);
    this.toks = tokens(n);
    this.text = ` ${this.toks.join(" ")} `;
    this.flat = n;
  }

  /** Returns the matched phrase (approximately as the user wrote it) or null. */
  find(phrase: string, fuzzy = false): string | null {
    if (SPECIAL.test(phrase)) return this.raw.includes(phrase) ? phrase : null;
    if (NON_LATIN.test(phrase)) {
      const p = normalize(phrase);
      return p && this.flat.includes(p) ? phrase : null;
    }
    const p = stemPhrase(phrase);
    if (!p) return null;
    if (this.text.includes(` ${p} `)) return phrase;
    // Typo tolerance for single, longer words ("stainles", "alumnium") — opt-in only.
    if (fuzzy && !p.includes(" ") && p.length >= 6) {
      const max = p.length >= 8 ? 2 : 1;
      for (const t of [...this.rawToks, ...this.toks]) {
        if (t.length >= 5 && t[0] === p[0] && Math.abs(t.length - p.length) <= 1 && levenshtein(t, p, max) <= max) return t;
      }
    }
    return null;
  }

  mask(phrase: string) {
    if (NON_LATIN.test(phrase)) {
      const p = normalize(phrase);
      if (p) this.flat = this.flat.split(p).join(" · ");
      return;
    }
    const p = stemPhrase(phrase);
    if (!p) return;
    this.text = this.text.split(` ${p} `).join(" · ");
    this.toks = this.text.trim().split(" ").filter((t) => t && t !== "·");
  }

  has(word: string) {
    return this.find(word) !== null;
  }
}

export function isQuestion(raw: string, localWords: string[] = []): boolean {
  const t = raw.trim().toLowerCase();
  if (/[?？؟]$/.test(t)) return true;
  if (/^(can|could|do|does|did|what|which|how|where|who|why|is|are|will|would|should|have|has|tell me|explain)\b/.test(t)) return true;
  return localWords.some((w) => (NON_LATIN.test(w) ? t.includes(w) : new RegExp(`^${w}(\\s|$)`).test(t)));
}

export function containsAny(raw: string, phrases: string[]): boolean {
  if (!phrases.length) return false;
  const h = new Haystack(raw);
  return phrases.some((p) => h.find(p) !== null);
}
