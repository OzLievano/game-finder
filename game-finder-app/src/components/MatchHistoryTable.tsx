import { useState, useEffect } from "react";
import { MuiTable, MuiTypography, MuiButton } from "@ozlievano/fabric";
import { Matches } from "./matches.api";

interface MatchHistoryTableProps {
  matches: Matches;
}

export const MatchHistoryTable = ({ matches }: MatchHistoryTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cachedMatches, setCachedMatches] = useState<Record<number, Matches>>({});
  const [currentMatches, setCurrentMatches] = useState<Matches>([]);
  const limit = 10; // Set limit for pagination

  useEffect(() => {
    const loadMatchHistory = () => {
      if (matches.length === 0) return; // If no matches, return early

      if (cachedMatches[currentPage]) {
        // Use cached matches if they exist for the current page
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

  const handleNextPage = () => {
    if (currentMatches.length === limit) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

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
                <td>{match.timezone}</td>
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
        <MuiButton variant="outlined" onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </MuiButton>
        <MuiButton
          variant="outlined"
          onClick={handleNextPage}
          disabled={currentMatches.length < limit}
        >
          Next
        </MuiButton>
      </div>
    </div>
  );
};
