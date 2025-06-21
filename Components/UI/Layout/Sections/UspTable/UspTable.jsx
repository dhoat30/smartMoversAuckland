import React from "react";
import styles from "./UspTable.module.scss";
import Container from "@mui/material/Container";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Button from "@mui/material/Button";

export default function UspTable({ uspTableData }) {
    if(uspTableData === undefined) return null;
  const truckIcon = uspTableData.image_group.truck_icon;
  const trueIcon = uspTableData.image_group.true_icon;
  const secondaryTrueIcon = uspTableData.image_group.secondary_true_icon;
  const falseIcon = uspTableData.image_group.false_icon;
   console.log(uspTableData)
  return (
    <section className={`${styles.section}`}>
      <Container className={`${styles.container}`} maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          className="pb-32"
        >
          Unbeatable service
        </Typography>
        <div className={`${styles.headerWrapper} pt-8 pb-8`}>
          <div></div>
          <div
            className={`${styles.truckIcon} image-wrapper pt-16 pb-16 flex align-center justify-center`}
          >
            <Image
              className={`${styles.img}`}
              src={truckIcon.url}
              alt={truckIcon.alt}
              fill
            />
          </div>
          <div
            className={`${styles.label} pt-16 pb-16 flex align-center justify-center`}
          >
            <Typography variant="h6" component="div" align="center" className={`${styles.text}`}>
              Local Movers
            </Typography>
          </div>
          <div
            className={`${styles.label} pt-16 pb-16 flex align-center justify-center`}
          >
            <Typography variant="h6" component="div" align="center" className={`${styles.text}`}>
              U-Haul Moving
            </Typography>
          </div>
        </div>

        <div className={`${styles.tableWrapper}`}>
          {uspTableData.row.map((item, index) => {
            return (
              <div key={index} className={`${styles.rowWrapper}`}>
                <div className={`${styles.rowLabel} flex align-center `}>
                  <Typography variant="subtitle1" component="div" className={`${styles.text}`}>
                    {item.label}
                  </Typography>
                </div>
                <div
                  className={`${styles.rowValue} flex align-center justify-center`}
                >
                  {item.value.map((val, valIndex) => {
                    let icon = null;
                    let valueBackground =
                      valIndex === 0 ? styles.valueBackground : null;
                    if (val.true_or_false === true && valIndex === 0) {
                      icon = trueIcon;
                    } else if (val.true_or_false === true && (valIndex === 1 || valIndex === 2)) {
                      icon = secondaryTrueIcon;
                    }
                    
                    
                    else {
                      icon = falseIcon;
                    }
                    return (
                      <div
                        key={Math.floor(Math.random() * 140000000)}
                        className={`${styles.rowValueIcon} ${valueBackground} pt-24 pb-24 flex align-center justify-center`}
                      >
                        <Image
                          src={icon?.url}
                          alt={icon?.alt}
                          width={icon?.width / 9}
                          height={icon?.height / 9}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className={`${styles.buttonWrapper} flex justify-center mt-40`}>
          <Link href="/get-free-quote">
            <Button variant="contained" size="large">
              Get free quote
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
4532;
2250;
