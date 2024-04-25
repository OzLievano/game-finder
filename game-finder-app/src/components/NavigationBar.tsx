import { useNavigate } from "react-router-dom";
import { MuiAppBar, MuiBox, MuiButton, MuiTypography } from "@ozlievano/fabric";
export const NavigationBar = () => {
  const navigate = useNavigate();

  const handleRedirect = (url: string) => {
    navigate(url);
  };
  /*
   TODO: Need to Hide create Match button unless user is authenticated
   TODO: Create Match needs redirect to a form 
   TODO: When user logs in , App Bar changes and has user icon to visit profile 
   TODO: Notification System to notify user a match is confirmed to be played 
   TODO: allow user to update match to change the status of the game Open, In Progress, Closed 
  */
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
