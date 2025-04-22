import Typography from "@mui/material/Typography";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function HeroUSP({ data, className }) {
  if (!data) return;
  return (
    <div className={`${className} mt-16` }>
      {( data.text_usp && data?.text_usp?.length > 0 )
      
      && 
      <div className="usp-wrapper mb-16">
      {data.text_usp.map((item, index) => {

        return (
          <Typography
            variant="subtitle2"
            component="div"
            className="text-usp flex align-center mb-8 gap-4"
            key={index}
            color="#232e85"
          >
            <CheckCircleIcon />
            <span> {item.value}</span>
          </Typography>
        );
      })}
    </div>
      }
 
      <div className="image-usp-wrapper flex gap-8 align-center flex-wrap">
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
    </div>
  );
}

