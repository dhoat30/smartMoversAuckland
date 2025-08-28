"use client";
import { useState, useRef, useEffect } from "react";
import { styled as style, useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "../../Icons/MenuIcon";
import Link from "next/link";
import ArrowIcon from "../../Icons/ArrowIcon";
import { headerLinks } from "@/utils/headerLinks";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import styles from "./MobileNavbar.module.scss";
const Drawer = dynamic(() => import("@mui/material/Drawer"));

const drawerWidth = 300;

const DrawerHeader = style("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function MobileNavbar() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(-1); // To track which submenu is open
  const pathname = usePathname();
  const router = useRouter(); // To programmatically navigate

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (event, item, index) => {
    event.preventDefault();

    // Check if the link has sublinks
    if (item.subLinks && item.subLinks.length > 0) {
      // If the same submenu is open, navigate to the link
      if (showMenu === index) {
        router.push(item.url); // Navigate to the link
        handleDrawerClose(); // Close the drawer after navigation
      } else {
        // Open the submenu
        setShowMenu(index);
      }
    } else {
      // If no sublinks, just navigate and close the drawer
      router.push(item.url);
      handleDrawerClose();
    }
  };

  const menuItems = headerLinks.map((item, index) => {
    return (
      <li
        className={`${styles.parentListItem}`}
        key={index}
      >
        <Link
          href={item.url}
          className={`${styles.parentLink} ${pathname === item.url ? "active" : ""}`}
          onClick={(event) => handleClick(event, item, index)}
        >
          {item.label}
          {item.subLinks && <ArrowIcon className="arrow" />}
        </Link>

        {item.subLinks && (
          <ul
            className={`${
              showMenu === index ? styles.block : styles.hidden
            } bg-primary-light text-surface-light top-8 dropdown`}
          >
            {item.subLinks.map((subLink, subIndex) => (
              <li key={subIndex} className={`${styles.childListItem}`}>
                <Divider
                  key={subIndex + 100}
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                />
                <Link href={subLink.url} className={`${styles.childLink}`}>
                  {subLink.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Divider
          key={index + 122}
          light={true}
          style={{ borderColor: "rgba(255,255,255,0.5)" }}
        />
      </li>
    );
  });

  return (
    <>
    <section className={`${styles.section}`}>
      <AppBar
    
        position="fixed"
        sx={{
          display: {
            xs: "block",
            lg: "none",
          },
          background: pathname.includes("blogs")
            ? "var(--light-surface-container-lowest)"
            : "var(--light-surface-container-lowest)",
        }}
      >
        <Container maxWidth="xl" sx={{ padding: "0 6px !important" }} >
          <Toolbar >
            <Box sx={{ width: "100%" }} id="menu-container">
              <div className={`${styles.menuLogoWrapper} flex align-center space-between`}>
                <IconButton
                  size="small"
                  aria-label="Open navigation menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleDrawerOpen}
                  color="primary"
                  disableRipple={true}
                  className="hamburger-icon"
                >
                  <MenuIcon fontSize="large" />
                </IconButton>
                <Link href="/" className="logo-wrapper">
                  <Image
                         src="/logo.png"
                         width={640/4 }
                         height={129/4  }
                    alt=" Logo"
                    quality={100}
                  />
                </Link>
              </div>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          position: "fixed",
          zIndex: "100",
        }}
        role="presentation"
        id="menu-appbar"
      >
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "var(--light-primary)",
            },
          }}
          anchor="left"
          open={open}
          onClose={handleDrawerClose}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon sx={{color: "white"}}/>
              ) : (
                <ChevronRightIcon sx={{color: "white"}}/>
              )}
            </IconButton>
          </DrawerHeader>
          <ul className={`${styles.list}`}>{menuItems}</ul>
          <Link href="/get-free-quote" style={{ margin: "16px" }}>
            <Button
              size="large"
              variant="outlined"
              className="button"
              onClick={handleDrawerClose}
              sx={{
                border: "1px solid white",
                color: "white",
                width: "100%",
                "&:hover": {
                  border: "1px solid #eaeaea",
                },
              }}
            >
              Get free quote
            </Button>
          </Link>
        </Drawer>
      </Box>
      </section>
    </>
  );
}

