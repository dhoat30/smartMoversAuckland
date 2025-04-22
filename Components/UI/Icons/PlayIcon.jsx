import React from "react";

export default function PlayIcon({ className }) {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M19.5 6C11.496 6 5 12.496 5 20.5C5 28.504 11.496 35 19.5 35C27.504 35 34 28.504 34 20.5C34 12.496 27.504 6 19.5 6ZM16.6 27.025V13.975L25.3 20.5L16.6 27.025Z"
        fill="#295000"
      />
      <circle cx="20" cy="20" r="19.5" stroke="#295000" />
    </svg>
  );
}
