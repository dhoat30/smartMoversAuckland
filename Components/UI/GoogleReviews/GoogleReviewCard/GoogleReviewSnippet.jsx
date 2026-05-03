import React from "react";
import styles from "../GoogleReviewsCarousle.module.scss";
import StarIcon from "@mui/icons-material/Star";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import googleReviewsData from "../../../../data/google-reviews.json";

const fallbackReviewerPics = (googleReviewsData.reviews || [])
  .filter(
    (review) =>
      review?.showInSnippet === true &&
      (review?.user?.thumbnail_remote || review?.user?.thumbnail),
  )
  .map((review) => ({
    src: review.user.thumbnail_remote || review.user.thumbnail,
    alt: review.user.name || "Google reviewer",
  }));

function GoogleReviewSnippet({
  reviewerPics,
  reviewTitle,
  leftAligned = false,
  className,
  showBorder = true,
  hidePics = false,
}) {
  const alignment = leftAligned ? "" : "0 auto";
  const reviewerImages = (reviewerPics || [])
    .map((pic) => {
      const image = pic?.image;
      const src = typeof image === "string" ? image : image?.url;
      if (!src) return null;

      return {
        src,
        alt: image?.alt || "Reviewer picture",
      };
    })
    .filter(Boolean);

  const imagesToShow = reviewerImages.length > 0 ? reviewerImages : fallbackReviewerPics;

  return (
    <div
      className={`${styles.reviewWrapper} ${showBorder ? styles.withBorder : ""} ${className }  flex gap-8 align-center`}
      style={{ margin: `${alignment}` }}
    >
      {hidePics ?          <Image src="/google.png" alt="Google" width={32} height={32} />
          : 
      <div className={`${styles.reviewerPicsWrapper} flex align-center `}>
        {imagesToShow.length > 0 &&
          imagesToShow.map((pic, index) => {
            return (
              <Image
                key={index}
                className={`${styles.reviewerPic}`}
                src={pic.src}
                alt={pic.alt}
                width={40}
                height={40}
                sizes="40px"
              />
            );
          })}
      </div>
      } 
      <div className={`${styles.reivewTitleWrapper}`}>
        <Typography
          variant="subtitle1"
          component="span"
          className={`${styles.reviewTitle} `}
          sx={{ fontSize: "0.7rem", textTransform:"uppercase", letterSpacing: "0.06em"   }}
        >
         Google Rating
        </Typography>
        <div className={`${styles.ratingWrapper} flex align-center gap-4`}>
         {hidePics ? null :  <Image src="/google.png" alt="Google" width={14} height={14} />}
          <div className={`${styles.starsWrapper} flex align-center`}>
            <StarIcon sx={{ color: "#FABB05", fontSize: "1.1rem" }} />
            <StarIcon sx={{ color: "#FABB05", fontSize: "1.1rem" }} />
            <StarIcon sx={{ color: "#FABB05", fontSize: "1.1rem" }} />
            <StarIcon sx={{ color: "#FABB05", fontSize: "1.1rem" }} />
            <StarIcon sx={{ color: "#FABB05", fontSize: "1.1rem" }} />
          </div>
          <Typography
            variant="body2"
            component="span"
            className={`${styles.reivewRating} `}
         
          >
            4.9
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default GoogleReviewSnippet;
