import { MuiButton } from "@ozlievano/fabric";
import React from "react";
import { getAuth } from "firebase/auth";

export const ProfilePage = () => {
  const handleSignOut = () => {
    // Sign out
    getAuth()
      .signOut()
      .then(() => {
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };
  return (
    <div>
      <MuiButton variant="contained" onClick={handleSignOut}>
        Sign Out
      </MuiButton>
    </div>
  );
};
