import React from "react";
import styles from "./ContactSection.module.scss";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ContactForm from "@/Components/UI/Forms/ContactForm";
import Paper from "@mui/material/Paper";
import ContactInfo from "@/Components/UI/Footer/ContactInfo";
import SocialWrapper from "@/Components/UI/Footer/SocialWrapper";

export default function ContactSection({
  title,
  description,
  map,
  contactInfo,
  uspData,
  socialData,
}) {
  return (
    <section className={`${styles.section}`}>
      <Container maxWidth="lg" className={`${styles.container} contact-info-wrapper grid`}>
        <div className={styles.contactContent}>
          <div className={styles.introCard}>
            <span className={styles.eyebrow}>Talk To Our Moving Team</span>
            <Typography variant="h2" component="h1" className={styles.title}>
              {title}
            </Typography>
            <Typography variant="subtitle1" component="p" className={styles.description}>
              {description}
            </Typography>
          </div>

          <div className={styles.contactInfoPanel}>
            <ContactInfo contactInfo={contactInfo} />
          </div>

          <div className={styles.socialPanel}>
            <Typography variant="h6" component="h2" className={styles.socialTitle}>
              Follow Us
            </Typography>
            <Typography variant="body2" component="p" className={styles.socialText}>
              See recent moves, customer updates, and helpful moving tips.
            </Typography>
            <div className={styles.socialWrapper}>
              <SocialWrapper socialData={socialData} />
            </div>
          </div>
        </div>

        <Paper className={styles.contactFormWrapper} variant="outlined">
          <div className={styles.formHeader}>
            <Typography variant="h4" component="h2" className={styles.formTitle}>
              Send Us A Message
            </Typography>
            <Typography variant="body2" component="p" className={styles.formText}>
              Share a few details and our team will get back to you as soon as possible.
            </Typography>
          </div>
          <ContactForm />
        </Paper>
      </Container>

      <div dangerouslySetInnerHTML={{ __html: map }} className={styles.mapWrapper} />
    </section>
  );
}
