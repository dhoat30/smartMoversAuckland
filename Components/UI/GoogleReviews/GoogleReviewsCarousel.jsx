"use client";

import React, { useCallback } from "react";
import Container from "@mui/material/Container";
import Link from "next/link";
import Button from "@mui/material/Button";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import GoogleReviewCard from "./GoogleReviewCard/GoogleReviewCard";
import Typography from "@mui/material/Typography";
import styles from "./GoogleReviewsCarousle.module.scss";
import useEmblaCarousel from "embla-carousel-react";
import PrevIcon from "@/Components/UI/Icons/PrevIcon";
import NextIcon from "@/Components/UI/Icons/NextIcon";
export default function GoogleReviewsCarousel({ data }) {
  console.log(data)
  if (!data && data.length === 0) return null;
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // filter review comment
  const filteredReviewData = data.filter((item) => {
    return item.rating === 5 && typeof item.snippet === "string";
  });

  const testimonialCardsJSX = filteredReviewData.map((item, index) => {
    if (index > 10) return null;
    return (
      <GoogleReviewCard
      key={index}
      name={item.user.name}
      description={item.snippet}
      customerPic={item.user.thumbnail}
      characterLimit={80}
    />
    );
  });

  return (
    <section className={`${styles.section}`}>
      <Container maxWidth="xl" className={`${styles.container}`}>
        <div className={`${styles.titleRow}`}>
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
        <div className="carousel-wrapper embla mt-32">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">{testimonialCardsJSX}</div>
        </div>

        <div className="embla__buttons_wrapper flex gap-8 justify-end mt-16">
          <button
            className="embla__prev"
            onClick={scrollPrev}
            aria-label="Previous slide"
            data-direction="prev"
          >
            <PrevIcon />
          </button>
          <button
            className="embla__next"
            onClick={scrollNext}
            aria-label="Next slide"
            data-direction="next"
          >
            <NextIcon />
          </button>
        </div>
      </div>
      </Container>

      {/* <Container maxWidth="xl" className="cta-wrapper mt-16 flex justify-center flex-wrap gap-16">
        <Link href={"https://g.page/r/CRY0fyyR4ApsEBM/review"} target="_blank">
          <Button variant={`contained`} endIcon={<CallMadeOutlinedIcon />}>
            Leave a Review
          </Button>
        </Link>
        <Link href="/customer-reviews">
          <Button variant={`outlined`}>Read All Reviews</Button>
        </Link>
      </Container> */}
    </section>
  );
}


