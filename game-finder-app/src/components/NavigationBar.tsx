import { useNavigate } from "react-router-dom";
import { MuiAppBar, MuiBox, MuiButton, MuiTypography } from "@ozlievano/fabric";
export const NavigationBar = () => {
  const navigate = useNavigate();

  const handleRedirect = (url: string) => {
    navigate(url);
  };

  return (
    <MuiAppBar>
      <MuiBox sx={{ display: "flex", justifyContent: "space-between" }}>
        <MuiTypography
          variant="h6"
          color="inherit"
          component="div"
          onClick={() => handleRedirect("/")}
        >
          AoS Match Finder
        </MuiTypography>
        <MuiButton color="inherit" onClick={() => handleRedirect("/login")}>
          Login
        </MuiButton>
      </MuiBox>
    </MuiAppBar>
  );
};
