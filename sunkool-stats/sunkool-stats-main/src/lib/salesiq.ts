/**
 * Link the current Zoho SalesIQ visit to a lead. Safe to call before the
 * widget script has loaded (or if it's blocked) — every step is guarded.
 */
export function identifySalesIQVisitor(details: {
  name?: string;
  email?: string;
  phone?: string;
}) {
  try {
    const visitor = window.$zoho?.salesiq?.visitor;
    if (details.name) visitor?.name?.(details.name);
    if (details.email) visitor?.email?.(details.email);
    if (details.phone) visitor?.contactnumber?.(details.phone);
  } catch {
    // Tracking must never break form submission.
  }
}
