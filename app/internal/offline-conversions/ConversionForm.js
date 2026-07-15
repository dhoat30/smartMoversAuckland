"use client";

import { useMemo, useState } from "react";
import styles from "../portal.module.scss";

function toNewZealandDateTimeInput(date) {
  const parts = new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(date)
    .reduce((values, part) => ({ ...values, [part.type]: part.value }), {});

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export default function ConversionForm() {
  const initialTime = useMemo(() => toNewZealandDateTimeInput(new Date()), []);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const conversionTime = String(formData.get("conversionTime") || "");
      if (!conversionTime) {
        throw new Error("Enter a valid conversion date and time.");
      }

      const response = await fetch("/api/internal/offline-conversions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          phone: formData.get("phone"),
          gclid: formData.get("gclid"),
          conversionTime,
          conversionValue: formData.get("conversionValue"),
          currency: formData.get("currency"),
          conversionName: formData.get("conversionName"),
          confirmCustomerData: formData.get("confirmCustomerData") === "on",
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok) {
        if (response.status === 401) {
          window.location.assign("/internal/login");
          return;
        }
        throw new Error(payload?.error || "The conversion could not be sent.");
      }

      setResult({ type: "success", ...payload });
      form.reset();
      form.elements.conversionTime.value = toNewZealandDateTimeInput(new Date());
      form.elements.currency.value = "NZD";
    } catch (error) {
      setResult({
        type: "error",
        message: error?.message || "The conversion could not be sent.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Customer email
          </label>
          <input
            className={styles.input}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">
            Phone number
          </label>
          <input
            className={styles.input}
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+64 21 123 4567"
            required
          />
        </div>

        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label className={styles.label} htmlFor="gclid">
            Google Click ID <span className={styles.optional}>(optional)</span>
          </label>
          <input
            className={styles.input}
            id="gclid"
            name="gclid"
            autoComplete="off"
            spellCheck="false"
          />
          <p className={styles.hint}>
            Leave blank only when matching through the customer email and phone number.
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="conversionTime">
            Conversion time
          </label>
          <input
            className={styles.input}
            id="conversionTime"
            name="conversionTime"
            type="datetime-local"
            defaultValue={initialTime}
            max={initialTime}
            required
          />
          <p className={styles.hint}>
            New Zealand time (Pacific/Auckland). Daylight saving is handled automatically.
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="conversionValue">
            Conversion value
          </label>
          <input
            className={styles.input}
            id="conversionValue"
            name="conversionValue"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="currency">
            Currency
          </label>
          <select className={styles.select} id="currency" name="currency" defaultValue="NZD">
            <option value="NZD">NZD — New Zealand dollar</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="conversionName">
            Conversion name
          </label>
          <input
            className={styles.input}
            id="conversionName"
            name="conversionName"
            value="Converted Lead"
            readOnly
          />
        </div>
      </div>

      <label className={styles.consent}>
        <input type="checkbox" name="confirmCustomerData" required />
        <span>
          I confirm this customer data may be used for advertising conversion measurement
          under Smart Movers&apos; privacy and consent obligations.
        </span>
      </label>

      <button className={styles.submitButton} type="submit" disabled={submitting}>
        {submitting ? "Sending securely…" : "Send conversion to Google Ads"}
      </button>

      {result?.type === "success" ? (
        <div className={`${styles.message} ${styles.success}`} role="status">
          Conversion accepted by Google for processing.
          <span className={styles.requestId}>Request ID: {result.requestId}</span>
        </div>
      ) : null}

      {result?.type === "error" ? (
        <div className={`${styles.message} ${styles.error}`} role="alert">
          <strong>Conversion not sent.</strong> {result.message}
        </div>
      ) : null}
    </form>
  );
}
