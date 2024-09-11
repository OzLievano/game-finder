import { useState, useEffect } from "react";
import { MuiTable, MuiTypography, MuiButton } from "@ozlievano/fabric";
import { Matches } from "../matches.api";
import { usePagination } from "../../hooks/usePagination";

interface MatchHistoryTableProps {
  matches: Matches;
}

export const MatchHistoryTable = ({ matches }: MatchHistoryTableProps) => {
  const limit = 5; 
  const { currentPage, handleNextPage, handlePreviousPage } = usePagination(limit);
  const [cachedMatches, setCachedMatches] = useState<Record<number, Matches>>({});
  const [currentMatches, setCurrentMatches] = useState<Matches>([]);

  useEffect(() => {
    const loadMatchHistory = () => {
      if (matches.length === 0) return;

      if (cachedMatches[currentPage]) {
        setCurrentMatches(cachedMatches[currentPage]);
        return;
      }

      // Paginate the match history based on current page
      const start = (currentPage - 1) * limit;
      const paginatedMatches = matches.slice(start, start + limit);

      setCurrentMatches(paginatedMatches);
      setCachedMatches((prevCache) => ({
        ...prevCache,
        [currentPage]: paginatedMatches,
      }));
    };

    loadMatchHistory();
  }, [currentPage, matches, cachedMatches]);

  return (
    <div className="match-table-container">
      <MuiTypography variant="h6">Match History</MuiTypography>
      <MuiTable className="mui-table">
        <thead>
          <tr>
            <th>Time Zone</th>
            <th>Match Type</th>
            <th>Format</th>
            <th>Language</th>
            <th>Status</th>
            <th>Opponent</th>
          </tr>
        </thead>
        <tbody>
          {currentMatches && currentMatches.length > 0 ? (
            currentMatches.map((match) => (
              <tr key={match._id}>
                <td>
  {match && match.timezone
    ? new Date(match.timezone).toLocaleString('en-US', { timeZone: 'UTC', hour12: true })
    : "-"}
</td>
                <td>{match.matchType}</td>
                <td>{match.format}</td>
                <td>{match.language}</td>
                <td>{match.gameStatus}</td>
                <td>{match.opponent}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No matches found</td>
            </tr>
          )}
        </tbody>
      </MuiTable>

      <div className="pagination-buttons">
        <MuiButton variant="outlined" onClick={() => handlePreviousPage()} disabled={currentPage === 1}>
          Previous
        </MuiButton>
        <MuiButton
          variant="outlined"
          onClick={() => handleNextPage(currentMatches)}
          disabled={currentMatches.length < limit}
        >
          Next
        </MuiButton>
      </div>
    </div>
  );
};
