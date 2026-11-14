"use client";

import { useEffect, useMemo, useState } from "react";
import { useNewZealandDate } from "@/hooks/useNewZealandDate";
import { rollRouteSchedule } from "@/utils/routeSchedule";

export function useRouteCard(routeId) {
  const [storedData, setStoredData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const today = useNewZealandDate();

  useEffect(() => {
    setStoredData(null);
    setLoaded(false);
    try {
      const raw = routeId && sessionStorage.getItem(`routeCard:${routeId}`);
      if (raw) setStoredData(JSON.parse(raw));
    } catch {
      setStoredData(null);
    } finally {
      setLoaded(true);
    }
  }, [routeId]);

  const data = useMemo(() => {
    if (!storedData || !today) return null;
    try {
      return {
        ...storedData,
        // Older session cards only have attributes. New cards retain the
        // original schedule to avoid drift after month-end rollovers.
        attributes: rollRouteSchedule(
          storedData.scheduleAttributes || storedData.attributes,
          today,
        ),
      };
    } catch {
      return null;
    }
  }, [storedData, today]);

  const fromLabel = typeof data?.movingFrom === "string"
    ? data.movingFrom
    : data?.movingFrom?.label || "";
  const toLabel = typeof data?.movingTo === "string"
    ? data.movingTo
    : data?.movingTo?.label || "";

  return { data, loaded, fromLabel, toLabel };
}
