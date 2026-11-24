/** A person in a solid circle: shown in the field where the assistant asks for the visitor's name. */
export function NameIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor" fillRule="evenodd" className={className}>
      {/* The disc, then the head and the shoulders cut out of it. */}
      <path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22Z M12 5.7a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z M5.67 18.4C7 15.7 9.3 14.4 12 14.4s5 1.3 6.33 4A9 9 0 0 1 5.67 18.4Z" />
    </svg>
  );
}

/** A telephone handset in a heavy ring: shown in the field where the assistant asks for the mobile number. */
export function MobileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <circle cx="12" cy="12" r="10.4" fill="none" stroke="currentColor" strokeWidth="2.2" />
      {/* The handset (Lucide's "phone" outline), filled solid and scaled to sit in the middle of the ring. */}
      <g transform="translate(5.16 5.16) scale(0.57)" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
      </g>
    </svg>
  );
}
