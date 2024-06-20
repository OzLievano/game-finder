import { useState, useEffect } from "react";
import { Matches } from "./matches.api";
import { useAuth } from "../hooks/useAuth";
import { MuiButton, MuiTable } from "@ozlievano/fabric";
import { useNavigate } from "react-router-dom";

export const MatchTable = () => {
  const [matches, setMatches] = useState<Matches | []>([]);
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

  const handleCreateNewMatch = () => {
    navigate("/create-match");
  };

  return (
    <div>
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
                <MuiButton variant="contained">Schedule Match</MuiButton>
              </td>
            </tr>
          ))}
        </tbody>
      </MuiTable>
    </div>
  );
};
