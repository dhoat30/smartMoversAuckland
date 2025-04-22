import { createTheme } from "@mui/material/styles";
//export theme settings

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#114D96",
    },
    secondary: {
      main: "#546E7A",
    },
    tertiary: {
      main: "#FFB74D",
    },
    contrastThreshold: 3.1,
  },
  typography: {
    fontFamily: ["var(--font-barlow)", "Segoe UI", "sans-serif"].join(","),
    h1: {
      fontSize: "4rem",
      fontWeight: 800,
      color: "var(--light-secondary)",

      "@media (max-width:900px)": {
        fontSize: "2.5rem",
      },
    },
    h2: {
      fontWeight: 800,
      fontSize: "3rem",
      lineHeight: "3.4rem",
      color: "var(--light-secondary)",

      "@media (max-width:600px)": {
        fontSize: "2rem",
        lineHeight: "2.4rem",
      }
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "0.05rem",
      color: "var(--light-on-surface)",
      "@media (max-width:600px)": {
        fontSize: "1.7rem",
        lineHeight: "2.2rem",
      },
    },
    h4: {
      fontWeight: 700,
      color: "var(--light-on-surface-variant)",
    },
    h5: {
      fontWeight: 700,
      color: "var(--light-on-surface)",
      "@media (max-width:600px)": {
        fontSize: "1.2rem",
        lineHeight: "1.4rem",
      }
    },

    h6: {
      fontWeight: 600,
      color: "var(--light-on-surface)",
    },
    body1: {
      color: "var( --light-on-surface-variant)",
    },
    body2: {},
    subtitle1: {
      color: "var(--light-on-surface-variant)",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          color: "var(--light-on-primary)",
          paddingRight: "32px",
          paddingLeft: "32px", 
          fontSize: "1rem", 
          textTransform: "inherit", 
          fontWeight: "500"
        },
        outlined: {
          border: "1px solid var(--light-primary)",
          color: "var(--light-primary)",
        },
      },
    },
  },
});
// mui theme settings
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#114D96",
    },
    secondary: {
      main: "#546E7A",
    },
    tertiary: {
      main: "#FFB74D",
    },
    contrastThreshold: 4.5,
  },
  typography: {
    fontFamily: ["var(--font-barlow)", "Segoe UI", "sans-serif"].join(","),
    h1: {
      fontSize: "5rem",
      fontWeight: 600,
      color: "var(--dark-on-surface)",
      "@media (max-width:900px)": {
        fontSize: "3rem",
      },
    },
    h2: {
      fontWeight: 600,
      color: "var(--dark-on-surface)",
      "@media (max-width:600px)": {
        fontSize: "2.5rem",
      },
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "0.05rem",
      color: "var(--dark-on-surface)",
    },
    h4: {
      fontWeight: 500,
      color: "var(--dark-on-surface)",

      "@media (max-width:900px)": {
        fontSize: "1.5rem",
      },
    },
    h5: {
      fontWeight: 400,
      letterSpacing: "0.02rem",

      color: "var(--dark-on-surface)",
    },

    h6: {
      fontWeight: 400,
      letterSpacing: "0.02rem",
      color: "var(--dark-on-surface)",
    },
    body1: {
      fontWeight: 350,
      letterSpacing: "0.02rem",
      color: "var( --dark-on-surface-variant)",
    },
    body2: {
      fontWeight: 300,
      letterSpacing: "0.05rem",
    },
    subtitle1: {
      color: "var(--dark-on-surface)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          textTransform: "none",
        },
      },
    },
  },
});
