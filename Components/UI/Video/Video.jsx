'use client'
import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import Image from "next/image";
import PlayIcon from "../Icons/PlayIcon";
import styles from "./Video.module.scss";
export default function Video({
  videoID,
  placeholderImage,
  className,
  showCompressedImage,
}) {
  const imageURL = showCompressedImage
    ? placeholderImage?.sizes?.large
    : placeholderImage?.url;
  const [isClient, setIsClient] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false); // New state for tracking video load
  useEffect(() => {
    setIsClient(true);
  }, []);
  // Function to load and play the video
  const handleImageClick = () => {
    setVideoLoaded(true);
  };
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`${styles.videoWrapper}`}>
        {!videoLoaded && (
          <>
            <div className={`${styles.videoOverlay}`}></div>
            <Image
              onClick={handleImageClick}
              src={imageURL} // Replace with your placeholder image path
              fill
              alt={placeholderImage.alt}
              style={{
                objectFit: "cover", // cover, contain, none
              }}
              sizes="(max-width: 1200px) 100vw, 50vw"
            />
            <div  className={`${styles.buttonStyled} flex align-center` }  onClick={handleImageClick}>
              <PlayIcon />
            </div  >
          </>
        )}

        {videoLoaded && (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoID}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
            width="100%"
            height="100%"
            controls={true}
          />
        )}
      </div>
    </div>
  );
}
