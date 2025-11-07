import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Image from "next/image";
import { services, commercialLinks, informationLinks } from "./FooterLinks";

import Copyright from "./Copyright";
import ContactInfo from "./ContactInfo";
import FooterCta from "../CTA/FooterCta";
import styles from "./Footer.module.scss";
import SocialWrapper from "./SocialWrapper";
export default function Footer({
  footerCtaData,
  showFooterCta = true,
  certifications,
  contactInfo,
  socialData,
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

      <div className={`${styles.footerSection}`}>
        <Container maxWidth="lg" className="row">
          {/* logo wrapper */}
          <div className={`${styles.footerWrapper}`}>
            <div className={`${styles.logoWrapper}`}>
              <Link href="/" className="mb-16 block mt-8">
                <Image
                  src="/logo.png"
                  width={292 / 1.3}
                  height={59 / 1.3}
                  alt="Logo"
                  style={{ cursor: "pointer" }}
                />
              </Link>
              <div className={`${styles.contactWrapper}`}>
             

                {socialData && socialData.length > 0 && (
                  <SocialWrapper socialData={socialData} />
                )}
              </div>
              {certifications && (
                <div className="certification-wrapper">
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ marginBottom: "8px" }}
                  >
                    Certifications
                  </Typography>
                  <div className="certification-logos flex flex-wrap gap-8 align-center">
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
   <div className={`${styles.contactWrapper}`}>
                {contactInfo && contactInfo.info && (
                  <div className="contact-section">
                    <ContactInfo contactInfo={contactInfo} />
                  </div>
                )}

             
              </div>
            <div className={`${styles.linksContainer}`}>
              <Typography
                variant="h6"
                component="div"
                sx={{ marginBottom: "8px" }}
              >
                Services
              </Typography>
              <ul
                className={`${styles.menuList}`}
                sx={{ margin: 0, padding: 0 }}
              >
                {services.map((link, index) => {
                  return (
                    <li key={index}>
                      <Link href={link.url} className={`${styles.link} body2`}>
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            {commercialLinks && commercialLinks.length > 0 && (
              <div className={`${styles.linksContainer}`}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ marginBottom: "8px" }}
                >
                  Commercial
                </Typography>
                <ul
                  className={`${styles.menuList}`}
                  sx={{ margin: 0, padding: 0 }}
                >
                  {commercialLinks.map((link, index) => {
                    return (
                      <li key={index}>
                        <Link
                          href={link.url}
                          className={`${styles.link} body2`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className={`${styles.linksContainer}`}>
              <Typography
                variant="h6"
                component="div"
                sx={{ marginBottom: "8px" }}
              >
                Information
              </Typography>
              <ul
                className={`${styles.menuList}`}
                sx={{ margin: 0, padding: 0 }}
              >
                {informationLinks.map((link, index) => {
                  return (
                    <li key={index}>
                      <Link href={link.url} className={`${styles.link} body2`}>
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Container>
      </div>
      {/* copyright container */}
      <Copyright />
    </>
  );
}
