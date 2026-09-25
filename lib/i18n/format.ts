/** Fill {placeholders} in a dictionary string. */
export function t(template: string, vars: Record<string, string | number> = {}) {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}
