import Typography from "@mui/material/Typography";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./HeroUSP.module.scss";
export default function HeroUSP({ data, className }) {
  if (!data) return;
  return (
    <div className={`${className} ${styles.textUspContainer} mt-16`}>
      {data.text_usp && data?.text_usp?.length > 0 && (
        <div className={`${styles.textUspWrapper} usp-wrapper grid gap-16`}>
          {data.text_usp.map((item, index) => {
            return (
              <Typography
                variant="subtitle2"
                component="div"
                className={`flex gap-4 ${styles.textUSP}`}
                key={index}
              >
                <CheckCircleIcon className={`${styles.icon}`} sx={{color: "var(--teal)"}}/>
                <span> {item.value}</span>
              </Typography>
            );
          })}
        </div>
      )}
  {data.image_usp && 
 
      <div className="image-usp-wrapper mt-16 flex gap-8 align-center flex-wrap">
        {data.image_usp &&
          data.image_usp.map((item, index) => {
            return (
              <Image
                key={index}
                src={item.image.url}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
              />
            );
          })}
      </div>
       }
    </div>
  );
}
