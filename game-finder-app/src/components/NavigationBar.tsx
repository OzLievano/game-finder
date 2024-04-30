import { useNavigate } from "react-router-dom";
import {
  MuiAppBar,
  MuiAvatar,
  MuiBox,
  MuiButton,
  MuiTypography,
} from "@ozlievano/fabric";
import { useAuth } from "../hooks/useAuth";
export const NavigationBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRedirect = (url: string) => {
    navigate(url);
  };
  /*
   TODO: Create Match needs redirect to a form 
   TODO: Notification System to notify user a match is confirmed to be played 
   TODO: allow user to update match to change the status of the game Open, In Progress, Closed 
   TODO: Table will need Pagination
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

        {user ? (
          // TODO: create User Profile Icon Component and Page
          <MuiAvatar onClick={() => handleRedirect("/user-profile")} />
        ) : (
          <MuiButton color="inherit" onClick={() => handleRedirect("/login")}>
            Login
          </MuiButton>
        )}
      </MuiBox>
    </MuiAppBar>
  );
};
