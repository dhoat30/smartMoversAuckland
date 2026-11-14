"use client";

import { useEffect, useState } from "react";
import { getNewZealandDate } from "@/utils/routeSchedule";

export function useNewZealandDate(initialDate = null) {
  // The listing supplies the server's date to keep the first client render in
  // sync. Session-only quote cards can wait until mounting to read the clock.
  const [today, setToday] = useState(initialDate);

  useEffect(() => {
    const updateDate = () => setToday(getNewZealandDate());
    updateDate();
    const interval = window.setInterval(updateDate, 60_000);
    window.addEventListener("focus", updateDate);
    window.addEventListener("pageshow", updateDate);
    document.addEventListener("visibilitychange", updateDate);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", updateDate);
      window.removeEventListener("pageshow", updateDate);
      document.removeEventListener("visibilitychange", updateDate);
    };
  }, [initialDate]);

  return today;
}
