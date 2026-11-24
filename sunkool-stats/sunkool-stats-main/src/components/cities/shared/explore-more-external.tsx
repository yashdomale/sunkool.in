// "Explore More" pill linking to the window-film page (as a full URL, opening normally).
// Used by the ahmedabad, hyderabad and kolkata film selectors. Not the same as
// ../city-explore-more.tsx, which is a next/link with different styling.
export function CityExploreMore() { return <a href="https://www.sunkool.in/window-film" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-2.5 font-display text-sm font-bold uppercase text-white transition-colors hover:bg-white/15">Explore More</a>; }
