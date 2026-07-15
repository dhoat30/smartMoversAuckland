import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  PORTAL_COOKIE_NAME,
  portalSessionIsValid,
} from "@/lib/internalPortalAuth";
import styles from "../portal.module.scss";

export const dynamic = "force-dynamic";

export default async function InternalLoginPage({ searchParams }) {
  const cookieStore = await cookies();
  const session = cookieStore.get(PORTAL_COOKIE_NAME)?.value;
  if (portalSessionIsValid(session)) redirect("/internal/offline-conversions");

  const params = await searchParams;
  const hasError = params?.error === "1";

  return (
    <main className={`${styles.shell} ${styles.loginShell}`}>
      <section className={`${styles.card} ${styles.loginCard}`}>
        <p className={styles.eyebrow} style={{ color: "#006da5" }}>
          Smart Movers internal
        </p>
        <h1 className={`${styles.title} ${styles.loginTitle}`}>Team sign in</h1>
        <p className={`${styles.description} ${styles.loginDescription}`}>
          Sign in to upload confirmed offline conversions to Google Ads.
        </p>

        <form
          action="/api/internal/auth/login"
          method="post"
          className={`${styles.form} ${styles.loginForm}`}
        >
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input
              className={styles.input}
              id="username"
              name="username"
              autoComplete="username"
              required
              autoFocus
            />
          </div>

          <div className={styles.field} style={{ marginTop: 18 }}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              className={styles.input}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          {hasError ? (
            <p className={`${styles.message} ${styles.error}`} role="alert">
              The username or password is incorrect.
            </p>
          ) : null}

          <button className={styles.submitButton} type="submit">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
