import Typography from "@mui/material/Typography";
import styles from "./Footer.module.scss";

const offices = [
  {
    label: "Auckland",
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "09 873 4212",
    email: process.env.NEXT_PUBLIC_AUCKLAND_EMAIL,
    address: process.env.NEXT_PUBLIC_AUCKLAND_ADDRESS,
    addressUrl: process.env.NEXT_PUBLIC_AUCKLAND_ADDRESS_URL,
  },
  {
    label: "Wellington",
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER_WELLINGTON || "04 887 2270",
    email: process.env.NEXT_PUBLIC_WELLINGTON_EMAIL,
    address: process.env.NEXT_PUBLIC_WELLINGTON_ADDRESS,
    addressUrl: process.env.NEXT_PUBLIC_WELLINGTON_ADDRESS_URL,
  },
  {
    label: "Christchurch",
    phone:
      process.env.NEXT_PUBLIC_PHONE_NUMBER_CHRISTCHURCH || "03 667 2254",
    email: process.env.NEXT_PUBLIC_CHRISTCHURCH_EMAIL,
    address: process.env.NEXT_PUBLIC_CHRISTCHURCH_ADDRESS,
    addressUrl: process.env.NEXT_PUBLIC_CHRISTCHURCH_ADDRESS_URL,
  },
  {
    label: "Hamilton",
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER_HAMILTON ,
    email: process.env.NEXT_PUBLIC_HAMILTON_EMAIL,
    address: process.env.NEXT_PUBLIC_HAMILTON_ADDRESS,
    addressUrl: process.env.NEXT_PUBLIC_HAMILTON_ADDRESS_URL,
  },
];

function getPhoneHref(phoneNumber) {
  return phoneNumber ? `tel:${phoneNumber.replace(/[^\d+]/g, "")}` : undefined;
}

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

export default function FooterContactInfo() {
  return (
    <div className={styles.footerContact}>
      <Typography variant="h6" component="h2" className="mb-16">
        Contact
      </Typography>

      <div className={styles.desktopOfficeList}>
        {offices.map((office) => (
          <div key={office.label} className={styles.officeGroup}>
            <Typography variant="subtitle2" component="h3">
              {office.label}
            </Typography>
            <OfficeDetails office={office} />
          </div>
        ))}
      </div>

      <div className={styles.mobileOfficeList}>
        {offices.map((office) => (
          <details key={office.label} className={styles.officeAccordion}>
            <summary>
              <Typography variant="subtitle2" component="span">
                {office.label}
              </Typography>
              <span className={styles.accordionIndicator} aria-hidden="true">
                +
              </span>
            </summary>
            <div className={styles.officeAccordionContent}>
              <OfficeDetails office={office} />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
