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
        const fetchMatches = await fetch("api/matchList");
        const matchData = await fetchMatches.json(); // Parse response as JSON
        setMatches(matchData);
      } catch (error) {
        console.error("Error fetching matches:", error);
        // Handle errors appropriately
      }
    };
    loadMatchList();
  }, []);

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
        <tr>
          <th> Created By </th>
          <th> Time Zone </th>
          <th> Match Type </th>
          <th> Format </th>
          <th> Language </th>
          <th> Status </th>
        </tr>
        {matches ? (
          matches.map((match) => {
            return (
              <tr>
                <td>{match.createdBy}</td>
                <td>{match.timezone}</td>
                <td>{match.matchType}</td>
                <td>{match.format}</td>
                <td>{match.language}</td>
                <td>{match.gameStatus}</td>
              </tr>
            );
          })
        ) : (
          <></>
        )}
      </MuiTable>
    </div>
  );
};
