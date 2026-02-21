"use client";

import React, { useCallback, useMemo } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import styles from "./GoogleReviewsCarousle.module.scss";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

import GoogleReviewCard from "./GoogleReviewCard/GoogleReviewCard";
import PrevIcon from "@/Components/UI/Icons/PrevIcon";
import NextIcon from "@/Components/UI/Icons/NextIcon";

export default function GoogleReviewsCarousel({ data }) {
  console.log(data);
  // ✅ proper empty check
  if (!data?.reviews?.length) return null;

  // filter review comment
  const filteredReviewData = useMemo(() => {
    return data.reviews
      .filter((item) => item?.rating === 5 && typeof item?.snippet === "string")
      .slice(0, 10);
  }, [data]);

  // ✅ AutoScroll plugin
  const autoScroll = useMemo(
    () =>
      AutoScroll({
        speed: 0.6, // increase for faster
        startDelay: 0,
        stopOnInteraction: false, // keep moving after button clicks / drag
        stopOnMouseEnter: false, // IMPORTANT: do NOT pause on carousel hover
        // If your users drag, Embla will stop momentarily then continue
      }),
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true },
    [autoScroll],
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // ✅ Pause ONLY when hovering a card
  const handleCardMouseEnter = useCallback(() => {
    if (!emblaApi) return;
    const plugin = emblaApi.plugins()?.autoScroll;
    plugin?.stop?.();
  }, [emblaApi]);

  const handleCardMouseLeave = useCallback(() => {
    if (!emblaApi) return;
    const plugin = emblaApi.plugins()?.autoScroll;
    plugin?.play?.();
  }, [emblaApi]);

  const testimonialCardsJSX = filteredReviewData.map((item, index) => {
    return (
      <div
        key={index}
        className="embla__slide" // ensure your CSS sets slide width
        onMouseEnter={handleCardMouseEnter}
        onMouseLeave={handleCardMouseLeave}
      >
        <GoogleReviewCard
          name={item?.user?.name}
          description={item?.snippet}
          customerPic={item?.user?.thumbnail}
          characterLimit={80}
        />
      </div>
    );
  });

  return (
    <section className={styles.section}>
      <Container maxWidth="xl" className={styles.container}>
        <div className={styles.titleRow}>
          <Typography
            variant="h2"
            component="h2"
            className="title"
            align="center"
          >
            Google Reviews
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className="description mt-16"
            align="center"
          >
            Explore authentic customer feedback and see why people trust us.
            Each review reflects the quality and dedication we bring to every
            service we provide.
          </Typography>
        </div>
      </Container>

      <div className="carousel-wrapper embla mt-32">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container google_embla__container">
            {testimonialCardsJSX}
          </div>
        </div>

        {/* <div className="embla__buttons_wrapper flex gap-8 justify-end mt-16">
            <button
              className="embla__prev"
              onClick={scrollPrev}
              aria-label="Previous slide"
              data-direction="prev"
              type="button"
            >
              <PrevIcon />
            </button>
            <button
              className="embla__next"
              onClick={scrollNext}
              aria-label="Next slide"
              data-direction="next"
              type="button"
            >
              <NextIcon />
            </button>
          </div> */}
      </div>
    </section>
  );
}
