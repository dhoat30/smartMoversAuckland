"use client";
import React from "react";

export default function MoverMateFrame() {
  return (
    <section style={{ paddingTop: "80px", background: "#f9fafb" }}>
      <iframe
        src="https://app.movermate.com.au/embed/booking-form/smart_movers"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ minHeight: "1300px" }}
      ></iframe>
    </section>
  );
}
