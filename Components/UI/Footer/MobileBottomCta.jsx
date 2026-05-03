"use client";

import Link from "next/link";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { usePathname } from "next/navigation";
import Button from "@mui/material/Button";
import {
  getPhoneLinkForCity,
  getQuoteCitySlugFromPathname,
} from "@/utils/phoneNumbers";
import styles from "./Footer.module.scss";

export default function MobileBottomCta() {
  const pathname = usePathname();
  const citySlug = getQuoteCitySlugFromPathname(pathname);
  const { phoneHref } = getPhoneLinkForCity(citySlug);
  const quoteHref =
    citySlug && citySlug !== "auckland"
      ? `/get-free-quote/${citySlug}`
      : "/get-free-quote";

  return (
    <>
      <div className={styles.mobileBottomCta}>
        <Button
          component={Link}
          href={quoteHref}
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          startIcon={<DescriptionOutlinedIcon />}
          className={styles.mobileBottomCtaButton}
          style={{textTransform: "capitalize"}}
        >
          Free quote
        </Button>
        <Button
          component={Link}
          href={phoneHref || "tel:"}
          variant="outlined"
          color="primary"
          size="large"
          fullWidth
          startIcon={<LocalPhoneIcon />}
          className={styles.mobileBottomCtaButton}
          aria-label="Call Smart Movers"
        >
          Call
        </Button>
      </div>
      <div className={styles.mobileBottomCtaSpacer} aria-hidden="true" />
    </>
  );
}
