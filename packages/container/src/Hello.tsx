import { Typography, createTheme, ThemeProvider } from "@mui/material";
import { red } from "@mui/material/colors";
import { CustomTypography } from "@monorepo-deploy-test/component/src";

const Hello = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: red[500],
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <h1>Hello from React!!!</h1>
      <Typography color="primary.main">hello world</Typography>
      <CustomTypography />
    </ThemeProvider>
  );
};

export default Hello;
