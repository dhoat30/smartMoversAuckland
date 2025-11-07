'use client';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import HeroUSP from "../../../USP/HeroUSP";
import styles from "./MovingCardFormSection.module.scss";
import dynamic from "next/dynamic";
import MovingCardSkeleton from "@/Components/UI/Skeletons/MovingCardSkeleton";
import { Suspense } from "react";
import LongDistanceRouteForm from "@/Components/UI/Forms/LongDistanceRouteForm";

// You can keep ssr:false if you like, but still wrap in Suspense.
const StorageSessionMovingCard = dynamic(
  () => import("@/Components/UI/LongDistanceRoutes/MovingCard/StorageSessionMovingCard"),
  { ssr: false, loading: () => <MovingCardSkeleton /> }
);

export default function MovingCardFormSection({ title, description, usp, graphic, routeId }) {
  return (
    <section className={styles.section}>
      <Container maxWidth="lg" className={styles.container}>
        <div className={`${styles.grid} grid gap-24`}>
          <Paper className={`${styles.contentWrapper} border-radius-12`} variant="outlined">
            {/* ✅ Add Suspense here */}
            <Suspense fallback={<MovingCardSkeleton />}>
              <StorageSessionMovingCard  routeId={routeId} />
            </Suspense>
          </Paper>

          <Paper className={`${styles.formWrapper} border-radius-12`} variant="outlined">
            <Typography component="h1" variant="h4" className="title">{title}</Typography>
            <Typography component="div" variant="body1" className="description mt-16">{description}</Typography>
            <HeroUSP data={usp} className="mb-16" />
            <LongDistanceRouteForm hideTitle className={styles.formWrapper} />
          </Paper>
        </div>
      </Container>
    </section>
  );
}
