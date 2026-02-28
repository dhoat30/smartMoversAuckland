import React from "react";
import styles from "../GoogleReviewsCarousle.module.scss";
import StarIcon from "@mui/icons-material/Star";
import GoogleIcon from "@/Components/UI/Icons/GoogleIcon";
import Image from "next/image";
import Typography from "@mui/material/Typography";
function GoogleReviewSnippet({
  reviewerPics,
  reviewTitle,
  leftAligned = false,
}) {
  console.log(reviewerPics);
  if (!reviewerPics || reviewerPics.length === 0) return;

  const alignment = leftAligned ? "" : "0 auto";
  return (
    <div
      className={`${styles.reviewWrapper} mb-16 flex gap-8`}
      style={{ margin: `${alignment}` }}
    >
      <div className={`${styles.reviewerPicsWrapper} flex align-center `}>
        {reviewerPics &&
          reviewerPics.length > 0 &&
          reviewerPics.map((item, index) => {
            return (
              <Image
                key={index}
                className={`${styles.reviewerPic}`}
                src={item.pic.url}
                alt={item.pic.alt || "Reviewer picture"}
                width={40}
                height={40}
                sizes="40px"
              />
            );
          })}
      </div>
      <div className={`${styles.reivewTitleWrapper}`}>
        <Typography
          variant="subtitle1"
          component="span"
          className={`${styles.reviewTitle} italic`}
          sx={{ fontSize: "0.8rem" }}
        >
          {reviewTitle ? reviewTitle : "Loved by locals"}
        </Typography>
        <div className={`${styles.ratingWrapper} flex align-center gap-4`}>
          <Image src="/google.png" alt="Google" width={14} height={14} />
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
            className={`${styles.reivewRating} italic`}
            sx={{ fontSize: "0.8rem", lineHeight: 0 }}
          >
            4.9/5
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default GoogleReviewSnippet;
