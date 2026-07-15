import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  PORTAL_COOKIE_NAME,
  portalSessionIsValid,
} from "@/lib/internalPortalAuth";
import ConversionForm from "./ConversionForm";
import styles from "../portal.module.scss";

export const dynamic = "force-dynamic";

export default async function OfflineConversionsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(PORTAL_COOKIE_NAME)?.value;
  if (!portalSessionIsValid(session)) redirect("/internal/login");

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Smart Movers internal</p>
            <h1 className={styles.title}>Offline conversions</h1>
            <p className={styles.description}>
              Upload confirmed converted leads directly to Google Ads. Customer contact
              details are hashed before leaving the server.
            </p>
          </div>
          <form action="/api/internal/auth/logout" method="post">
            <button className={styles.logoutButton} type="submit">
              Sign out
            </button>
          </form>
        </header>

        <ConversionForm />
      </section>
    </main>
  );
}
