"use client";

import React, { useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function GoogleAutocomplete({
  value,
  onChange,
  onSelect,
  error,
  helperText,
  label,
  required,
  className,
  autoComplete,
  inputTitle,
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const init = () => {
      if (cancelled) return;
      if (!window.google?.maps?.places) return;
      if (!inputRef.current || autocompleteRef.current) return;

      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "nz" },
      });
      autocompleteRef.current = ac;

      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (!place || !place.address_components) return;

        let streetNumber = "";
        let streetName = "";
        let suburb = "";
        let city = "";
        let region = "";
        let postalCode = "";

        place.address_components.forEach((c) => {
          const t = c.types;
          if (t.includes("street_number")) streetNumber = c.long_name;
          if (t.includes("route")) streetName = c.long_name;
          if (t.includes("sublocality") || t.includes("sublocality_level_1")) suburb = c.long_name;
          if (t.includes("locality")) city = c.long_name;
          if (t.includes("administrative_area_level_1")) region = c.long_name;
          if (t.includes("postal_code")) postalCode = c.long_name;
        });

        const unformatted = { streetNumber, streetName, suburb, city, region, postalCode };
        if (place.formatted_address) {
          onSelect({
            formattedAddress: place.formatted_address,
            unformattedAddress: unformatted,
          });
        }
      });
    };

    // if already loaded, init immediately
    if (window.google?.maps?.places) {
      init();
    } else {
      // otherwise wait for the global event from layout
      const onReady = () => init();
      window.addEventListener("gmaps-ready", onReady);
      // also do a small polling in case user navigated from another page and onLoad already fired
      const t = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(t);
          init();
        }
      }, 100);
      // cleanup
      return () => {
        cancelled = true;
        window.removeEventListener("gmaps-ready", onReady);
        clearInterval(t);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [onSelect]);

  return (
    <>
      {inputTitle && (
        <Typography variant="h6" component="h2" className="mt-24">
          {inputTitle}
        </Typography>
      )}
      <TextField
        className={className}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputRef={inputRef}
        color="secondary"
        fullWidth
        required={required}
        autoComplete={autoComplete}
        error={!!error}
        helperText={error ? helperText : undefined}
      />
    </>
  );
}
