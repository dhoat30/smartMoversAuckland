'use client'

import React from "react";
import Typography from "@mui/material/Typography";
import styles from "./Footer.module.scss";
import { getPhoneHref, officeContacts } from "@/utils/officeContactData";

function OfficeDetails({ office }) {
  return (
    <div className={styles.officeDetails}>
      {office.phone && (
        <a
          href={getPhoneHref(office.phone)}
          className={styles.footerContactLink}
        >
          <Typography variant="body2" component="span">
            {office.phone}
          </Typography>
        </a>
      )}

      {office.email && (
        <a
          href={`mailto:${office.email}`}
          className={styles.footerContactLink}
        >
          <Typography variant="body2" component="span">
            {office.email}
          </Typography>
        </a>
      )}

      {office.address && office.addressUrl && (
        <a
          href={office.addressUrl}
          className={styles.footerContactLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography variant="body2" component="span">
            {office.address}
          </Typography>
        </a>
      )}
    </div>
  );
}

export default function ContactInfo({ className }) {
  const visibleOffices = officeContacts.filter(
    (office) => office.phone || office.email || office.address,
  );

  if (visibleOffices.length === 0) return null;

  return (
    <div
      className={`${className} ${styles.contactInfoWrapper} footer-contact-wrapper flex flex-column gap-8`}
    >
      <Typography variant="h6" component="div" className="mb-8">
        Contact
      </Typography>

      {visibleOffices.map((office) => (
        <div key={office.label} className={styles.officeGroup}>
          <Typography variant="subtitle2" component="h3">
            {office.label}
          </Typography>
          <OfficeDetails office={office} />
        </div>
      ))}
    </div>
  );
}
