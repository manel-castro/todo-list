import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#FFD600" }, // yellow
    secondary: { main: "#FF9800" }, // orange
    background: {
      default: "#FFF9E6", // light yellow background for the whole app
    },
  },
});

export default theme;
