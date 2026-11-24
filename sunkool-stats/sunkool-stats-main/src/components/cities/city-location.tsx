"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { nearestCity, type CitySlug } from "@/lib/cities";

const redirectedKey = "sunkool-location-redirected-to";

export function CityLocation({ city }: { city: CitySlug }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const requesting = useRef(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    // A successful redirect should land on the detected city without asking again.
    if (sessionStorage.getItem(redirectedKey) === city) {
      sessionStorage.removeItem(redirectedKey);
      return;
    }
    if (!element.open) element.show();
    return () => { if (element.open) element.close(); };
  }, [city]);

  function dismiss() {
    dialog.current?.close();
  }

  function allow() {
    if (requesting.current) return;
    if (!navigator.geolocation) { dismiss(); return; }
    requesting.current = true;
    setLocating(true);

    // Calling this directly from Yes lets the browser show its permission prompt.
    // A denied or unavailable location leaves the current page open.
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        // Matched locally against the known city coordinates, not the URL's
        // city, so a stale link always resolves to where the visitor actually is.
        const match = nearestCity(position.coords.latitude, position.coords.longitude);
        // Temporary diagnostic: desktop geolocation is often WiFi/IP-based rather
        // than real GPS and can resolve well outside city radius. Remove once the
        // "Yes click on /indore doesn't redirect to Nagpur" report is resolved.
        console.log("[city-location]", { lat: position.coords.latitude, lon: position.coords.longitude, accuracy: position.coords.accuracy, matchedCity: match, currentCity: city });
        if (new URLSearchParams(window.location.search).has("debug-location")) {
          window.alert(`lat/lon: ${position.coords.latitude}, ${position.coords.longitude}\naccuracy: ${position.coords.accuracy}m\nmatched city: ${match ?? "none (>75km from every covered city)"}\ncurrent page: ${city}`);
        }
        if (match && match !== city) {
          sessionStorage.setItem(redirectedKey, match);
          dismiss();
          router.replace(`/${match}`, { scroll: false });
          return;
        }
        dismiss();
        setLocating(false);
        requesting.current = false;
      }, () => {
        dismiss();
        setLocating(false);
        requesting.current = false;
      }, {
        timeout: 10000,
        maximumAge: 300000,
        enableHighAccuracy: false,
      });
    } catch {
      dismiss();
      setLocating(false);
      requesting.current = false;
    }
  }

  return (
    <dialog ref={dialog} className="city-location-popup" aria-labelledby="city-location-title">
      <span className="city-location-icon" aria-hidden="true">◎</span>
      <h2 id="city-location-title">Use your location?</h2>
      <p>Show the SUNKOOL page for the city you are in.</p>
      <div className="city-location-actions">
        <button type="button" className="city-location-decline" onClick={dismiss} disabled={locating}>No</button>
        <button type="button" className="city-location-allow" onClick={allow} disabled={locating}>{locating ? "Locating…" : "Yes"}</button>
      </div>
    </dialog>
  );
}
