export function IconPSThermo() {
  return (
    <svg viewBox="0 0 64 64" className="ps-icon-svg" aria-hidden="true" focusable="false">
      <circle className="ps-arc" cx="32" cy="32" r="25" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" pathLength={100} strokeDasharray="78 100" />
      <path className="ps-draw" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" pathLength={100} strokeDasharray="100" d="M29 15v20.6a6.5 6.5 0 1 0 6 0V15M26 15h9" />
      <circle className="ps-fill-in" cx="32" cy="46.5" r="3.2" fill="currentColor" />
    </svg>
  );
}

export function IconPSShield() {
  return (
    <svg viewBox="0 0 24 24" className="ps-icon-svg" aria-hidden="true" focusable="false">
      <circle className="ps-pulse" cx="12" cy="11.2" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path className="ps-draw" d="M12 2.5l8 3.2v6.3c0 5.1-3.4 8.7-8 10.5-4.6-1.8-8-5.4-8-10.5V5.7l8-3.2z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" pathLength={100} strokeDasharray="100" />
    </svg>
  );
}

export function IconPSSignal() {
  return (
    <svg viewBox="0 0 40 40" className="ps-icon-svg" aria-hidden="true" focusable="false">
      <circle className="ps-ring ps-ring-1" cx="12" cy="28" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle className="ps-ring ps-ring-2" cx="12" cy="28" r="15" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect className="ps-bar ps-bar-1" x="6" y="24" width="4.5" height="8" rx="1.2" fill="currentColor" />
      <rect className="ps-bar ps-bar-2" x="14.5" y="17" width="4.5" height="15" rx="1.2" fill="currentColor" />
      <rect className="ps-bar ps-bar-3" x="23" y="9" width="4.5" height="23" rx="1.2" fill="currentColor" />
    </svg>
  );
}
