import type { ReactNode } from "react";
import { HOME_FEATURES } from "@/lib/home-features";
import { FeatureTimeline } from "./feature-timeline";

/**
 * The five feature points, shown with the home page statistics.
 *
 * `lead` (the statistics row) is rendered inside the pinned stage above the
 * points, so it stays on screen while they play and scrolls away with them.
 *
 * Server component: the list below is plain, fully readable markup, which is
 * what users see without JS and with reduced motion. FeatureTimeline (client)
 * enhances it with the scroll-driven timeline; the styling lives in globals.css
 * under "Home feature timeline" (.stl-*).
 */
export function FeatureHighlights({ lead }: { lead?: ReactNode }) {
  return (
    <section aria-labelledby="feature-highlights-heading">
      <h2 id="feature-highlights-heading" className="sr-only">
        Why choose Sunkool window film
      </h2>

      <FeatureTimeline lead={lead}>
        <ol className="stl-list">
          {HOME_FEATURES.map(({ id, title, description }, i) => (
            <li key={id} className="stl-item">
              <i className="stl-dot" aria-hidden="true" />
              <span className="stl-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </FeatureTimeline>
    </section>
  );
}
