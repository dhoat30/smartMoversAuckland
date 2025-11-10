'use client';
import { ThemeProvider } from '@mui/material/styles';
import {lightTheme } from "../utils/themeSettings"
import { useState, useEffect } from 'react';
import Script from 'next/script'
import LoadingIndicator from '@/Components/UI/Loader/LoadingIndicator';
import TrackingPersistence from '@/Components/TrackingPersistence/TrackingPersistence';
export default function ClientProvider({ children }) {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 3000); // Adjust timing
  //   return () => clearTimeout(timer);
  // }, []);

  return <ThemeProvider theme={lightTheme}>
    <LoadingIndicator />
    {/* {isLoading && <Loading />} */}
    {children}
            <TrackingPersistence />

        <Script
          id="google-maps"
          strategy="afterInteractive"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=weekly&libraries=places`}
          onLoad={() => {
            // signal to the app that maps is ready
            window.dispatchEvent(new Event("gmaps-ready"));
          }}
        />
    </ThemeProvider>;
}
