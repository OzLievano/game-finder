import { useNavigate } from "react-router-dom";
import {
  MuiAppBar,
  MuiAvatar,
  MuiBox,
  MuiButton,
  MuiTypography,
} from "@ozlievano/fabric";
import { useAuth } from "../hooks/useAuth";
import './navigationbar.css';
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
      <MuiBox
        sx={{ display: "flex", justifyContent: "space-between", zIndex: 100 }}
      >
        {user ? (<MuiTypography
          variant="h6"
          className="navbar-logo"
          color="inherit"
          component="div"
          sx={{ cursor: "pointer" }}
          onClick={() => handleRedirect("/matches")}
        >
          AoS Match Finder
        </MuiTypography>) : (
          <MuiTypography
          variant="h6"
          className="navbar-logo"
          color="inherit"
          component="div"
          sx={{ cursor: "pointer" }}
          onClick={() => handleRedirect("/")}
        >
          AoS Match Finder
        </MuiTypography>
        )}

        {user ? (
          <MuiAvatar className="navbar-avatar" onClick={() => handleRedirect("/user-profile")} />
        ) : (
          <MuiButton className="navbar-button" onClick={() => handleRedirect("/login")}>Login</MuiButton>
        )}
      </MuiBox>
    </MuiAppBar>
  );
};
