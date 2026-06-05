export const revalidate = 2592000;

import Script from "next/script";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import Header from "@/Components/UI/Header/Header";
import Footer from "@/Components/UI/Footer/Footer";
import { getOptions } from "@/utils/fetchData";
import styles from "./page.module.scss";

export const metadata = {
  title: "Blog | Smart Movers",
  description:
    "Read the latest moving tips, guides, and updates from Smart Movers.",
};

export default async function BlogPage() {
  const options = await getOptions();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <Container maxWidth="lg">
            <Typography component="h1" variant="h1" className={styles.title}>
              Blog
            </Typography>
            <Typography component="p" variant="body1" className={styles.copy}>
              Moving tips, planning guides, and updates from Smart Movers.
            </Typography>
          </Container>
        </section>

        <Container maxWidth="lg" className={styles.blogContainer}>
          <div id="soro-blog" className={styles.embed} />
        </Container>

        <Script
          src="https://app.trysoro.com/api/embed/52a8db71-8b9a-40f9-ac54-71377222c534"
          strategy="afterInteractive"
        />
      </main>
      <Footer
        showFooterCta={true}
        footerCtaData={options.footer_cta}
        contactInfo={options.contact_info}
        socialData={options.social_links}
      />
    </>
  );
}
