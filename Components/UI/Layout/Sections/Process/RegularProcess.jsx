import styles from "./Process.module.scss";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
export default function RegularProcess({ title, description, cards }) {
  if (!cards) return null;

  const stepCards = cards.map((item, index) => {
    return (
    <div className={`${styles.stepWrapper}`} key={index}>
        <div className={`${styles.title}`}>
          <div className={`${styles.stepTitleNumberWrapper} flex gap-8 align-bottom`}>
            <div className={`${styles.stepNumber}`}>0{index + 1}</div>
            <Typography
              variant="h5"
              component="h3"
         
            >
              {item.title}
            </Typography>
          </div>
         
        </div>
        <div className={`${styles.content}`}>
          <Typography
            variant="body1"
            component="div"
            className="description"
            dangerouslySetInnerHTML={{ __html: item.description }}
          ></Typography>
        </div>
      </div>
    );
  });
  
  return (
      <section className={`${styles.section}`}>
        <Container maxWidth="xl" className={`${styles.container}`}>
          <div className={`${styles.titleWrapper}`}>
            <Typography variant="h2" component="h2" className={`${styles.titleWrapper} center-align`}>
              {title}
            </Typography>
            {description && (
               <Typography variant="body1" component="p" >
               {description}
             </Typography>
            ) }
         
          </div>

          <div className={`${styles.stepsWrapper} grid gap-80 space-between mt-40`}>{stepCards}</div>
        </Container>
      </section>
  );
}
