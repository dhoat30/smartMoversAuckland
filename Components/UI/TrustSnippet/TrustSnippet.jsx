import Image from "next/image";
import Typography from "@mui/material/Typography";
import styles from "./TrustSnippet.module.scss";

export default function TrustSnippet({
  icon,
  iconSrc,
  iconAlt = "",
  iconSize = 34,
  title,
  description,
  className = "",
  priority = false,
}) {
  const iconElement =
    icon ||
    (iconSrc ? (
      <Image
        src={iconSrc}
        alt={iconAlt}
        width={iconSize}
        height={iconSize}
        priority={priority}
      />
    ) : null);

  return (
    <div className={`${styles.wrapper} ${className} flex gap-8 align-center`}>
      {iconElement}
      <div className={styles.titleWrapper}>
        <Typography
          variant="subtitle1"
          component="div"
          className={styles.title}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          component="div"
          className={styles.description}
        >
          {description}
        </Typography>
      </div>
    </div>
  );
}
