"use client";
import React, { useState, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "next/link";
import Image from "next/image";
import { headerLinks } from "@/utils/headerLinks";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Paper from "@mui/material/Paper";
import { usePathname } from "next/navigation";
import styles from "./DesktopNavbar.module.scss";
function DesktopNavbar() {
  const [showMenu, setShowMenu] = useState(-1);
  const menuRef = useRef(null);
  // router
  const pathname = usePathname();
  const isActive = (path) => {
    return pathname === path;
  };
  // drop down logic
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showDropdown = (event, index) => {
    setTimeout(() => {
      setShowMenu(index);
    }, 200); // Delay in milliseconds
  };
  const hideDropdown = (event, index) => {
    event.preventDefault();
    setTimeout(() => {
      setShowMenu(-1);
    }, 200); // Del
  };

  const toggleDropdown = (event, index) => {
    event.preventDefault();
    setShowMenu(index === showMenu ? -1 : index);
  };

  // render menu items
  const menuItems = headerLinks.map((item, index) => {
    return (
      <Box
        className={`${styles.link}`}
        component="li"
        key={index}
        sx={{ color: "white", display: "block", position: "relative" }}
        onMouseLeave={
          item.subLinks ? (event) => hideDropdown(event, index) : null
        }
        onMouseEnter={
          item.subLinks ? (event) => showDropdown(event, index) : null
        }
        onClick={item.subLinks ? (event) => toggleDropdown(event, index) : null}
      >
        <Link href={item.url} className={`${isActive(item.url) ? "active" :  ""} ${styles.link} flex align-center`}>
          <Typography component="span" variant="body1" align="center">
            {item.label}
          </Typography>
          {item.subLinks && (
            <KeyboardArrowDownRoundedIcon
              className={`${showMenu === index && "arrow-up"} arrow `}
            />
          )}
        </Link>

        {item.subLinks && (
          <Paper
            component="ul"
            variant="outlined"
            className={`${
              showMenu === index ? "block" : "hidden"
            } ${styles.subLinksWrapper}`}
            sx={{
              position: "absolute",
              left: "-16px",
              paddingLeft: 0,
              display: `${showMenu === index ? "block" : "none"} `,
            }}
          >
            {item.subLinks.map((subLink, subIndex) => (
              <li key={subIndex}>
                <Link href={subLink.url}>
                  <Typography
                    className={`${styles.subLink}`}
                    component="span"
                    variant="body1"
                  >
                    {subLink.label}
                  </Typography>
                </Link>
              </li>
            ))}
          </Paper>
        )}
      </Box>
    );
  });
  return (
    <>
      <AppBar
      className={`${styles.section}`}
        position="static"
        sx={{
          display: { xs: "none", lg: "block" },
          background: pathname.includes("blogs")
            ? "var(--light-surface-container-lowest)"
            : "var(--light-surface-container-lowest)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters className={`${styles.gridLinksWrapper} flex space-between`}>
            {/* logo  */}
            <Link href="/">
              <Image
                src="/logo.png"
                width={640/3 }
                height={129/3  }
                alt="Logo"
                style={{ cursor: "pointer" }}
                quality={100}
              />
            </Link>
            {/* menu */}
            <div className={`${styles.linksWrapper} flex align-center gap-16 space-between`}>
              <Box
                component="ul"
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  margin: 0,
                }}
              >
                {menuItems}
              </Box>
              <Link href="/get-free-quote">
                <Button size="large" variant="contained">
                  Get a quote
                </Button>
              </Link>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
export default DesktopNavbar;
