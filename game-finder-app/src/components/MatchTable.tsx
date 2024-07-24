import { useState, useEffect } from "react";
import { Matches } from "./matches.api";
import { useAuth } from "../hooks/useAuth";
import { MuiButton, MuiTable } from "@ozlievano/fabric";
import { Notification } from "./Notification";
import { useNavigate } from "react-router-dom";

export const MatchTable = () => {
  const [matches, setMatches] = useState<Matches | []>([]);
  const [notification, setNotification] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadMatchList = async () => {
      try {
        // Ensure user is defined before attempting to access getIdToken()
        if (!user) {
          throw new Error("User is not logged in");
        }

        const idToken = await user.getIdToken();
        const fetchMatches = await fetch("api/openMatchList", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!fetchMatches.ok) {
          throw new Error(`Fetch failed with status ${fetchMatches.status}`);
        }

        const matchData = await fetchMatches.json(); // Parse response as JSON
        console.log("matchData", matchData);
        setMatches(matchData);
      } catch (error) {
        console.error("Error fetching matches:", error);
        // Handle errors appropriately
      }
    };

    // Check if user is defined to avoid calling getIdToken() when user is null
    if (user) {
      loadMatchList();
    }
  }, [user]); // Depend on user for triggering useEffect when user changes

  const clearNotification = () => {
    setNotification("");
  };

  const handleError = (errorMessage: string) => {
    setNotification(errorMessage);
  };

  const handleCreateNewMatch = () => {
    navigate("/create-match");
  };

  const handleScheduleMatch = async (id: number) => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`api/match/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          gameStatus: "pending",
          user: user.name,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        handleError(errorMessage);
        throw new Error(`Failed to update match ${id}`);
      }

      // Optionally handle successful response here
      // For example, update UI or trigger a refresh
    } catch (error) {
      console.error("Error scheduling match:", error);
      // Handle error scenario, e.g., show error message to the user
    }
  };

  return (
    <div>
      <Notification message={notification} onClose={clearNotification} />
      {user ? (
        <MuiButton variant="contained" onClick={handleCreateNewMatch}>
          Create a New Match
        </MuiButton>
      ) : (
        <></>
      )}
      <MuiTable>
        <thead>
          <tr>
            <th>Created By</th>
            <th>Time Zone</th>
            <th>Match Type</th>
            <th>Format</th>
            <th>Language</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match._id}>
              <td>{match.createdBy || "-"}</td>
              <td>{match.timezone || "-"}</td>
              <td>{match.matchType || "-"}</td>
              <td>{match.format || "-"}</td>
              <td>{match.language || "-"}</td>
              <td>{match.gameStatus || "-"}</td>
              <td>
                <MuiButton
                  variant="contained"
                  onClick={() => {
                    handleScheduleMatch(match._id);
                  }}
                >
                  Schedule Match
                </MuiButton>
              </td>
            </tr>
          ))}
        </tbody>
      </MuiTable>
    </div>
  );
};
