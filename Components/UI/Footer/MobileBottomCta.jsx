"use client";

import Link from "next/link";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { usePathname } from "next/navigation";
import Button from "@mui/material/Button";
import {
  getCitySlugFromPathname,
  getPhoneLinkForCity,
} from "@/utils/phoneNumbers";
import { getQuoteLinkFromPathname } from "@/utils/quoteLinks";
import styles from "./Footer.module.scss";

export default function MobileBottomCta() {
  const pathname = usePathname();
  const citySlug = getCitySlugFromPathname(pathname);
  const { phoneHref } = getPhoneLinkForCity(citySlug);
  const quoteHref = getQuoteLinkFromPathname(pathname);

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
