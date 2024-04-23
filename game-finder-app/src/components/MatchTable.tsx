import { useState, useEffect } from "react";
import { Matches } from "./matches.api";
import { MuiButton, MuiTable } from "@ozlievano/fabric";

export const MatchTable = () => {
  const [matches, setMatches] = useState<Matches | []>([]);
  useEffect(() => {
    const loadMatchList = async () => {
      try {
        const fetchMatches = await fetch("api/matchList");
        console.log(fetchMatches);
        const matchData = await fetchMatches.json(); // Parse response as JSON
        console.log("match", matchData);
        setMatches(matchData);
      } catch (error) {
        console.error("Error fetching matches:", error);
        // Handle errors appropriately
      }
    };
    loadMatchList();
  }, []);

  return (
    <div>
      <MuiButton variant="contained">Create a New Match</MuiButton>
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
