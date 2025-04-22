import React from "react";
import styles from "./LocationsCovered.module.scss";
import Container from "@mui/material/Container";
import Image from "next/image";
import { Typography } from "@mui/material";
export default function LocationsCovered({
  title,
  description,
  image,
  locations,
}) {
  return (
    <section className={`${styles.section}`}>
      <Container maxWidth="lg" className={`${styles.container} grid gap-32`}>
        <div className={`${styles.contentWrapper}`}>
          <Typography variant="h3" component="h2" className={`${styles.title}`}>
            {title}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={`${styles.description} mt-16`}
          >
            {description}
          </Typography>
          <ul className={`${styles.locationsWrapper} grid mt-16 gap-8`}>
            {locations &&
              locations.map((location, index) => (
               
                  <Typography
                    variant="subtitle1"
                    component="li"
                    className={`${styles.location} mt-8`}
                    key={index}
                  >
                    {location.location}
                  </Typography>
              ))}
            </ul> 
        </div>
        <div
          className={`${styles.imgWrapper} image-wrapper`}
          style={{ paddingBottom: `${(image.height / image.width) * 100}%` }}
        >
          <Image src={image.url} fill alt={image.alt || title} />
        </div>
      </Container>
    </section>
  );
}
