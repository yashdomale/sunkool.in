import type { CSSProperties } from "react";

// Re-skins the shared surface tokens to a deep navy for the admin area only,
// so every admin component (tables, forms, dialogs) matches without touching
// the public site's theme. Portalled UI (popovers, dialogs) renders outside
// the admin layout, so it applies this style itself.
//
// Layering, darkest to lightest: page (void, with --admin-bg-top fading in at the
// top, see .admin-backdrop in globals.css) -> cards and sidebar (carbon-2) ->
// raised surfaces such as menus and tooltips (carbon-3).
export const adminTheme = {
  "--color-void": "#050d1b",
  "--admin-bg-top": "#08152a",
  "--color-carbon-2": "#0c1b32",
  "--color-carbon-3": "#12233d",
} as CSSProperties;
