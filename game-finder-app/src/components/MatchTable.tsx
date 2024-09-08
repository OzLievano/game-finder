import { useState, useEffect } from "react";
import { Matches } from "./matches.api";
import { useAuth } from "../hooks/useAuth";
import { MuiButton, MuiTable } from "@ozlievano/fabric";
import { useNotification } from "./NotificationContext";
import { useNavigate } from "react-router-dom";
import './tableStyles.css';

export const MatchTable = () => {
  const [matches, setMatches] = useState<Matches | []>([]);
  const [cachedMatches, setCachedMatches] = useState<Record<number, Matches>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true); // Track if there's more data
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const limit = 10;

  useEffect(() => {
    const loadMatchList = async (page: number) => {
      if (cachedMatches[page]) {
        setMatches(cachedMatches[page]);
        return;
      }

      try {
        if (!user) {
          throw new Error("User is not logged in");
        }

        const idToken = await user.getIdToken();
        const fetchMatches = await fetch(`/api/openMatchList?page=${page}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!fetchMatches.ok) {
          throw new Error(`Fetch failed with status ${fetchMatches.status}`);
        }

        const matchData = await fetchMatches.json();
        setMatches(matchData);
        setCachedMatches((prevCache) => ({ ...prevCache, [page]: matchData }));

        // Check if fewer items than the limit were returned (meaning no more pages)
        if (matchData.length < limit) {
          setHasMorePages(false);
        } else {
          setHasMorePages(true); // There could still be more pages
        }
      } catch (error: any) {
        console.error("Error fetching matches:", error);
        showNotification(error.message, "error");
      }
    };

    if (user) {
      loadMatchList(currentPage);
    }
  }, [user, currentPage, cachedMatches, showNotification]);

  const handleNextPage = () => {
    if (hasMorePages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

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
            <th>Actions</th>
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
                  onClick={() => handleScheduleMatch(match._id)}
                >
                  Schedule Match
                </MuiButton>
              </td>
            </tr>
          ))}
        </tbody>
      </MuiTable>
      <div className="pagination-buttons">
        <MuiButton variant="outlined" onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </MuiButton>
        <MuiButton variant="outlined" onClick={handleNextPage} disabled={!hasMorePages}>
          Next
        </MuiButton>
      </div>
    </div>
  );
};
