import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#FFD600" }, // yellow
    secondary: { main: "#FF9800" }, // orange
    background: {
      default: "#FFF9E6", // light yellow background for the whole app
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#FFC107",
          },
        },
        containedSecondary: {
          "&:hover": {
            backgroundColor: "#FB8C00",
          },
        },
        textPrimary: {
          "&:hover": {
            backgroundColor: "rgba(255,214,0,0.08)",
          },
        },
        textSecondary: {
          "&:hover": {
            backgroundColor: "rgba(255,152,0,0.08)",
          },
        },
        outlinedPrimary: {
          "&:hover": {
            backgroundColor: "rgba(255,214,0,0.04)",
          },
        },
        outlinedSecondary: {
          "&:hover": {
            backgroundColor: "rgba(255,152,0,0.04)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
            color: "#FF9800",
          },
        },
      },
    },
  },
});

export default theme;
