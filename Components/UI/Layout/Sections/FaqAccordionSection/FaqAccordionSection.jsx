import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import FaqAccordion from "@/Components/UI/Accordion/FaqAccordion";
import styles from "./FaqAccordionSection.module.scss";

function FaqAccordionSection({ title, description, qaData }) {
  if (!qaData) return null;

  const isGenericTitle = !title || title.trim().toLowerCase() === "faq";
  const headingText = isGenericTitle ? "Frequently asked questions" : title;

  return (
    <section className={styles.section}>
      <Container maxWidth="lg">
        <div className={styles.gridWrapper}>
          <div className={styles.titleWrapper}>
            <span className={styles.eyebrow}>FAQ</span>
            <Typography
              variant="h4"
              component="h2"
              className={styles.heading}
            >
              {headingText}
            </Typography>
            {description && (
              <Typography
                variant="body1"
                component="p"
                className={styles.description}
              >
                {description}
              </Typography>
            )}

            <div className={styles.helpCard}>
              <Typography
                variant="body1"
                component="p"
                className={styles.helpText}
              >
                Still have questions? Our team is happy to help — get a fast,
                no-obligation quote.
              </Typography>
              <Link href="/get-free-quote" className={styles.helpButton}>
                Get a free quote
              </Link>
            </div>
          </div>

          <FaqAccordion qaData={qaData} />
        </div>
      </Container>
    </section>
  );
}

export default FaqAccordionSection;
