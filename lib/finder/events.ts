/**
 * Tiny event bus so any input on the site (hero, header search, sidebars) can
 * route a question to the nearest Finder: the on-page section if one is
 * listening, otherwise the global Finder dialog.
 */
export const ASK_EVENT = "rm:finder-ask";
export const OPEN_EVENT = "rm:finder-open";

export interface AskDetail {
  query?: string;
}

export function openFinderDialog(query?: string) {
  window.dispatchEvent(new CustomEvent<AskDetail>(OPEN_EVENT, { detail: { query } }));
}

/** Ask the on-page Finder; falls back to the dialog when none is mounted. */
export function askFinder(query: string) {
  const ev = new CustomEvent<AskDetail>(ASK_EVENT, { detail: { query }, cancelable: true });
  window.dispatchEvent(ev);
  if (!ev.defaultPrevented) openFinderDialog(query);
}
