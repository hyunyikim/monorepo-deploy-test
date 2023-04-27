import { Typography, createTheme, ThemeProvider } from "@mui/material";
import { red } from "@mui/material/colors";
import { CustomTypography } from "@monorepo-deploy-test/component";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: red[500],
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Typography color="primary.main">hello world</Typography>
      <CustomTypography />
    </ThemeProvider>
  );
}

export default App;
