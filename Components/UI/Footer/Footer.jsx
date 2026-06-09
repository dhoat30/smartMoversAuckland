import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Image from "next/image";
import { services, commercialLinks, informationLinks } from "./FooterLinks";

import Copyright from "./Copyright";
import FooterCta from "../CTA/FooterCta";
import styles from "./Footer.module.scss";
import SocialWrapper from "./SocialWrapper";
import MobileBottomCta from "./MobileBottomCta";
import FooterContactInfo from "./FooterContactInfo";
export default function Footer({
  footerCtaData,
  showFooterCta = true,
  certifications,
  socialData,
  hideBotttomCta = false,
}) {
  return (
    <>
      {showFooterCta && (
        <FooterCta
          title={footerCtaData.title}
          description={footerCtaData.description}
          cta={footerCtaData.cta_link}
        />
      )}

      <footer className={styles.footerSection}>
        <Container maxWidth="xl">
          <div className={styles.footerWrapper}>
            <div className={styles.brandColumn}>
              <div>
                <Link href="/" className={`${styles.logoLink} block`}>
                  <Image
                    src="/logo.png"
                    width={292 / 1.3}
                    height={59 / 1.3}
                    alt="Smart Movers"
                  />
                </Link>
                <Typography variant="body2" component="p" className="mt-16">
                  Reliable local and nationwide moving services across New
                  Zealand.
                </Typography>

                <div className="mt-24">
                  {socialData && socialData.length > 0 && (
                    <SocialWrapper socialData={socialData} />
                  )}
                </div>
                {certifications && (
                  <div className="mt-24">
                    <Typography
                      variant="h6"
                      component="h2"
                      className="mb-8"
                    >
                      Certifications
                    </Typography>
                    <div
                      className={`${styles.certificationLogos} flex flex-wrap gap-8 align-center`}
                    >
                      {certifications.cards.map((item, index) => {
                        return (
                          <Image
                            key={index}
                            src={item.certification_image.url}
                            alt={item.alt ? item.alt : "certification"}
                            width={item.certification_image.width}
                            height={item.certification_image.height}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

            </div>

            <FooterContactInfo />

            <div className={styles.linksContainer}>
              <Typography
                variant="h6"
                component="h2"
                className="mb-8"
              >
                Services
              </Typography>
              <ul className={styles.menuList}>
                {services.map((link, index) => {
                  return (
                    <li key={index}>
                      <Link href={link.url} className={styles.footerLink}>
                        <Typography variant="body2" component="span">
                          {link.label}
                        </Typography>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            {commercialLinks && commercialLinks.length > 0 && (
              <div className={styles.linksContainer}>
                <Typography
                  variant="h6"
                  component="h2"
                  className="mb-8"
                >
                  Commercial
                </Typography>
                <ul className={styles.menuList}>
                  {commercialLinks.map((link, index) => {
                    return (
                      <li key={index}>
                        <Link href={link.url} className={styles.footerLink}>
                          <Typography variant="body2" component="span">
                            {link.label}
                          </Typography>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className={styles.linksContainer}>
              <Typography
                variant="h6"
                component="h2"
                className="mb-8"
              >
                Information
              </Typography>
              <ul className={styles.menuList}>
                {informationLinks.map((link, index) => {
                  return (
                    <li key={index}>
                      <Link href={link.url} className={styles.footerLink}>
                        <Typography variant="body2" component="span">
                          {link.label}
                        </Typography>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Container>
      </footer>
      <Copyright />
      {!hideBotttomCta && <MobileBottomCta />}
    </>
  );
}
