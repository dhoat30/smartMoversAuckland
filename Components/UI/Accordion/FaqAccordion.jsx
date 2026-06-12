"use client";

import { useState } from "react";
import styles from "./FaqAccordion.module.scss";

export default function FaqAccordion({ qaData }) {
  const [openIndex, setOpenIndex] = useState(-1);

  if (!qaData?.length) return null;

  return (
    <div className={styles.list}>
      {qaData.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div
            key={index}
            className={`${styles.item} ${isOpen ? styles.open : ""}`}
          >
            <h3 className={styles.questionHeading}>
              <button
                type="button"
                id={buttonId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span className={styles.questionText}>{item.question}</span>
                <span className={styles.icon} aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={styles.panel}
            >
              <div className={styles.panelInner}>
                <div
                  className={styles.answer}
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
