/**
 * Splits a feature-chip list into groups that never break apart when the chips wrap:
 * "99% UV Block" is kept on the same line as "Crystal Clear Vision"; every other chip is its own group.
 */
export function groupUvWithClarity(features: readonly string[]): string[][] {
  const groups: string[][] = [];
  for (const f of features) {
    const last = groups[groups.length - 1];
    if (f === "Crystal Clear Vision" && last?.[last.length - 1] === "99% UV Block") {
      last.push(f);
    } else {
      groups.push([f]);
    }
  }
  return groups;
}
