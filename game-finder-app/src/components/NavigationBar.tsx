import { useNavigate } from "react-router-dom";
import { MuiAppBar, MuiBox, MuiButton, MuiTypography } from "@ozlievano/fabric";
export const NavigationBar = () => {
  const navigate = useNavigate();

  const handleRedirectToLogin = () => {
    navigate("/login");
  };

  return (
    <MuiAppBar>
      <MuiBox sx={{ display: "flex", justifyContent: "space-between" }}>
        <MuiTypography variant="h6" color="inherit" component="div">
          AoS Match Finder
        </MuiTypography>
        <MuiButton color="inherit" onClick={handleRedirectToLogin}>
          Login
        </MuiButton>
      </MuiBox>
    </MuiAppBar>
  );
};
