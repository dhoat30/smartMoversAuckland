"use client";
import React from "react";
import Script from "next/script";

export default function MoverMateFrame({ id = "smart_movers" }) {
  return (
    <section style={{ paddingTop: "80px", background: "#f9fafb" }}>
      <iframe
        id="movermate-booking-form"
        src={`https://app.movermate.com.au/embed/booking-form/${id}`}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ minHeight: "1300px" }}
      ></iframe>
      <Script
        src="https://app.movermate.com.au/scripts/embed/booking-form.js"
        strategy="afterInteractive"
      />
    </section>
  );
}
