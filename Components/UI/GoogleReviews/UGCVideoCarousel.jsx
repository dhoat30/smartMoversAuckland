"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import useEmblaCarousel from "embla-carousel-react";

import NextIcon from "@/Components/UI/Icons/NextIcon";
import PlayIcon from "@/Components/UI/Icons/PlayIcon";
import PrevIcon from "@/Components/UI/Icons/PrevIcon";
import styles from "./UGCVideoCarousel.module.scss";

export default function UGCVideoCarousel({ videos }) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(null);
  const validVideos = Array.isArray(videos)
    ? videos.filter(
        (video) =>
          typeof video?.youtube_video_id === "string" &&
          Boolean(video.youtube_video_id.trim()),
      )
    : [];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!validVideos.length) return null;

  return (
    <div className={styles.carousel} aria-label="Customer video testimonials">
      <div className={styles.heading}>
        <Typography variant="h2" component="h2" className="title" align="center">
          Real Moves, Real Stories
        </Typography>
        <Typography
          variant="body1"
          component="p"
          className="description mt-16"
          align="center"
        >
          Watch real customers share their Smart Movers experience in their own
          words.
        </Typography>
      </div>

      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {validVideos.map(
            ({ thumbnail, youtube_video_id: videoId }, index) => (
              <div className={styles.slide} key={`${videoId}-${index}`}>
                <div className={styles.videoWrapper}>
                  {activeVideoIndex === index ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId.trim())}?autoplay=1&playsinline=1&rel=0`}
                      title={`Customer video testimonial ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <button
                      type="button"
                      className={styles.facade}
                      onClick={() => setActiveVideoIndex(index)}
                      aria-label={`Play customer video testimonial ${index + 1}`}
                    >
                      <Image
                        src={
                          thumbnail?.sizes?.large ||
                          thumbnail?.url ||
                          `https://i.ytimg.com/vi/${encodeURIComponent(videoId.trim())}/oar2.jpg`
                        }
                        alt=""
                        fill
                        quality={90}
                        sizes="(max-width: 600px) 72vw, (max-width: 900px) 33vw, (max-width: 1200px) 25vw, 20vw"
                        className={styles.thumbnail}
                      />
                      <span className={styles.playButton} aria-hidden="true">
                        <PlayIcon />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {validVideos.length > 1 && (
        <div className={styles.controls}>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous customer video"
          >
            <PrevIcon />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next customer video"
          >
            <NextIcon />
          </button>
        </div>
      )}
    </div>
  );
}
