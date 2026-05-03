"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollReveal({ threshold = 12, topOffset = 8 } = {}) {
  return useScrollRevealState({ threshold, topOffset }).isVisible;
}

export function useScrollRevealState({ threshold = 12, topOffset = 8 } = {}) {
  const lastScrollY = useRef(0);
  const [state, setState] = useState({
    isVisible: true,
    isAtTop: true,
  });

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    setState((current) => ({
      ...current,
      isAtTop: window.scrollY <= topOffset,
    }));

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= topOffset) {
        setState({
          isVisible: true,
          isAtTop: true,
        });
        lastScrollY.current = currentScrollY;
        return;
      }

      if (Math.abs(delta) < threshold) return;

      setState({
        isVisible: delta < 0,
        isAtTop: false,
      });
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold, topOffset]);

  return state;
}
