import Image from "next/image";

/** The small red-and-white megaphone shown beside the Announcements heading. */
export function MegaphoneIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/images/updates/megaphone.png"
      alt=""
      width={174}
      height={144}
      aria-hidden="true"
      className={className}
    />
  );
}
