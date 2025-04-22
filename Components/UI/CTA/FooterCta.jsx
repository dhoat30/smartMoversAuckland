import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import React from "react";
import styles from "./FooterCTA.module.scss";
export default function FooterCta({ title, description, cta }) {
  return (
  <section className={`${styles.section}`}>
      <Container maxWidth="lg">
        <div className={ `${styles.wrapper}`}>
          <div className={ `${styles.contentWrapper}`}>
            <Typography
              component="h2"
              variant="h2"
              sx={{ fontWeight: 700 }}
              align="center"
              color="white"
              className="title"
            >
              {title}
              
            </Typography>
            <Typography
              component="div"
              variant="h2"
              sx={{ fontWeight: 700 }}
              align="center"
              color="white"
              className="title"
            >
              {description}              
            </Typography>
            {/* <Typography
              component="p"
              variant="body1"
              align="center"
              color="white"
              className="description mt-16"
            >
            
            </Typography> */}
            <div className="button-wrapper flex justify-center mt-24 gap-16 flex-wrap">
              <Link href={cta.url}>
                <Button
                  size="large"
                  variant="contained"
                  sx={{
                    background: "white",
                    color: "var(--dark-on-primary)",
                    "&:hover": {
                      background: "#eaeaea",
                    },
                  }}
                >
                  {cta.title}
                </Button>
              </Link>

              {/* <Link href="/get-free-quote">
              <Button
                size="large"
                variant="outlined"
                sx={{
                  border: "1px solid white",
                  color: "white",
                  "&:hover": {
                    border: "1px solid #eaeaea",
                  },
                }}
              >
                {cta.label}
              </Button>
            </Link> */}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

