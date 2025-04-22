"use client";

import Script from 'next/script';

export default function GoogleMapsLoader({ onLoad }) {
  const GOOGLE_API_KEY='AIzaSyBfneaVJapdnzhBVxj47xdiqh6-1pfnDOE'

  return (
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`}
      strategy="lazyOnload"
      onLoad={onLoad}
    />
  );
}