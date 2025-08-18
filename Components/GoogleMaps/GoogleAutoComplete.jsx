// components/GoogleAutocomplete.js

"use client";

import React, { useEffect, useRef } from "react";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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
  inputTitle
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  useEffect(() => {
    if (window.google && inputRef.current && !autocompleteRef.current) {
      // Initialize Autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "nz" }, // Restrict to New Zealand
      });

      // Add listener for place selection
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        
  if (!place || !place.address_components) return;

  let streetNumber = "";
  let streetName = "";
  let suburb = "";
  let city = "";
  let region = "";
  let postalCode = "";
  place.address_components.forEach((component) => {
    const types = component.types;

    if (types.includes("street_number")) {
      streetNumber = component.long_name;
    }
    if (types.includes("route")) {
      streetName = component.long_name;
    }
    if (types.includes("sublocality") || types.includes("sublocality_level_1")) {
      suburb = component.long_name;
    }
    if (types.includes("locality")) {
      city = component.long_name;
    }
    if (types.includes("administrative_area_level_1")) {
      region = component.long_name; // e.g., Auckland Region
    }
    if (types.includes("postal_code")) {
      postalCode = component.long_name;
    }
  });
  const unFormatted = {
    streetNumber,
    streetName,
    suburb,
    city,
    region,
    postalCode,
  };
        if (place && place.formatted_address) {
          onSelect({formattedAddress: place.formatted_address, unformattedAddress: unFormatted});
        }
      });
    }
  }, [onSelect]);

  return (
    <>
    {inputTitle && 
      <Typography variant="h6" component="h2" className="mt-24">
      {inputTitle}
      </Typography>
    }
  
    <TextField
    className={className}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputRef={inputRef}
      color={"secondary"}
      fullWidth
      required={required}
      autoComplete={autoComplete}
      error={error}
      helperText={error && helperText}
      sx={{maxWidth: "500px"}}
    />
    </>
  );
}
