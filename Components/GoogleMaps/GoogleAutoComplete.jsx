"use client";

import React, { useEffect, useRef } from "react";
import TextField from '@mui/material/TextField';

export default function GoogleAutocomplete({
  value,
  onChange,
  onSelect,
  error,
  helperText,
  label,
  required,
  className, 
  autoComplete
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (window.google && inputRef.current && !autocompleteRef.current) {
      // Initialize Autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: ["nz"] }, // Restrict to New Zealand
      });

      // Add listener for place selection
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
          onSelect(place.formatted_address);
        }
      });
    }
  }, [onSelect]);

  return (
    <TextField
    className={className}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputRef={inputRef}
      fullWidth
      required={required}
      autoComplete={autoComplete}
      error={error}
      helperText={helperText}
    />
  );
}
