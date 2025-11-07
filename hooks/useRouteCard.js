// hooks/useRouteCard.ts
"use client";
import { useEffect, useState } from "react";

export function useRouteCard(routeId) {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [fromLabel, setFromLabel] = useState("");
  const [toLabel, setToLabel] = useState("");

  useEffect(() => {
    try {
      if (!routeId) { setLoaded(true); return; }
      const raw = sessionStorage.getItem(`routeCard:${routeId}`);
      if (!raw) { setLoaded(true); return; }

      const parsed = JSON.parse(raw);
      setData(parsed);
      setFromLabel(typeof parsed.movingFrom === "string" ? parsed.movingFrom : parsed.movingFrom?.label || "");
      setToLabel(typeof parsed.movingTo === "string" ? parsed.movingTo : parsed.movingTo?.label || "");
    } catch (e) {
      setData(null);
    } finally {
      setLoaded(true);
    }
  }, [routeId]);

  return { data, loaded, fromLabel, toLabel };
}
