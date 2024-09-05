import { useState, useEffect } from "react";
import { Matches } from "./matches.api";
import { useAuth } from "../hooks/useAuth";
import { MuiButton, MuiTable } from "@ozlievano/fabric";
import { useNotification } from "./NotificationContext";
import { useNavigate } from "react-router-dom";
import './tableStyles.css';

export const MatchTable = () => {
  const [matches, setMatches] = useState<Matches | []>([]);
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const loadMatchList = async () => {
      try {
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

        const matchData = await fetchMatches.json();
        setMatches(matchData);
      } catch (error: any) {
        console.error("Error fetching matches:", error);
        showNotification(error.message, "error");
      }
    };

    if (user) {
      loadMatchList();
    }
  }, [user, showNotification]);

  const handleCreateNewMatch = () => {
    navigate("/create-match");
  };

  const handleScheduleMatch = async (id: string) => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`api/match/${id}/schedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          gameStatus: "pending",
          userName: user.displayName,
        }),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        showNotification(errorMessage, "error");
        throw new Error(`Failed to update match ${id}`);
      }

      showNotification("Match scheduled successfully", "success");
    } catch (error: any) {
      console.error("Error scheduling match:", error);
      console.log(error);
      showNotification(error.message, "error");
    }
  };

  return (
    <div className="match-table-container">
      {user ? (
        <MuiButton className="create-match-button" variant="contained" onClick={handleCreateNewMatch}>
          Create a New Match
        </MuiButton>
      ) : null}
      <MuiTable className="mui-table">
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
                  className="schedule-button"
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
