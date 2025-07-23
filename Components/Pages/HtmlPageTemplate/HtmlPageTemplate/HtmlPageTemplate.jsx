import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import styles from "./HtmlPageTemplate.module.scss";
export default function HtmlPageTemplate({ pageData }) {
  return (
    <Paper elevation={1}>
      <Container maxWidth="md" className={`${styles.section}`}>
        {/* <Box className="title">
          <Typography variant="h2" component="h1" >
            {pageData.title.rendered}
          </Typography>
        </Box> */}
        <Box className="content">
          <Typography
            variant="body1"
            component="div"
            className="body1 policy-html"
            dangerouslySetInnerHTML={{ __html: pageData.content.rendered }}
          ></Typography>
        </Box>
      </Container>
    </Paper>
  );
}

