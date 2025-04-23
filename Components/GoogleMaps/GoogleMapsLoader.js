"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function GoogleMapsLoader({ onLoad }) {
  const GOOGLE_API_KEY = "AIzaSyBfneaVJapdnzhBVxj47xdiqh6-1pfnDOE";

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      onLoad();
    }
  }, [onLoad]);

  return (
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`}
      strategy="lazyOnload"
      onLoad={onLoad}
    />
  );
}