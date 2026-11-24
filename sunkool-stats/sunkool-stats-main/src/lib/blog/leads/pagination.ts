/**
 * Which page links to show: the first and last page and the current page with its
 * neighbours, e.g. `1 … 4 [5] 6 … 40`. `null` marks a gap (an ellipsis), so a long
 * result set never turns into a wall of page numbers.
 */
export function pageWindow(page: number, last: number): (number | null)[] {
  const wanted = [...new Set([1, page - 1, page, page + 1, last])]
    .filter((p) => p >= 1 && p <= last)
    .sort((a, b) => a - b);

  const out: (number | null)[] = [];
  wanted.forEach((p, index) => {
    const skipped = index > 0 ? p - wanted[index - 1] - 1 : 0;
    // An ellipsis that hides a single page is no shorter than the page link itself.
    if (skipped === 1) out.push(p - 1);
    else if (skipped > 1) out.push(null);
    out.push(p);
  });
  return out;
}
