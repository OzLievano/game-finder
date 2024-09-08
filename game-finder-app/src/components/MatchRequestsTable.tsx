import { useState, useEffect } from "react";
import { MuiButton, MuiTable, MuiTypography } from "@ozlievano/fabric";
import { MatchRequests } from "./matches.api";

interface MatchRequestsTableProps {
  matchRequests: MatchRequests;
  onApprove: (matchId: string, requestId: string) => void;
  onReject: (matchId: string, requestId: string) => void;
}

export const MatchRequestsTable = ({ matchRequests, onApprove, onReject }: MatchRequestsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cachedRequests, setCachedRequests] = useState<Record<number, MatchRequests>>({});
  const [currentRequests, setCurrentRequests] = useState<MatchRequests>([]);
  const limit = 10;

  useEffect(() => {
    const loadMatchRequests = () => {
      if (cachedRequests[currentPage]) {
        setCurrentRequests(cachedRequests[currentPage]);
        return;
      }

      // Paginate the requests (simulated here)
      const start = (currentPage - 1) * limit;
      const paginatedRequests = matchRequests.slice(start, start + limit);

      setCurrentRequests(paginatedRequests);
      setCachedRequests((prevCache) => ({
        ...prevCache,
        [currentPage]: paginatedRequests,
      }));
    };

    loadMatchRequests();
  }, [currentPage, matchRequests, cachedRequests]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const hasAnyRequests = currentRequests.some(
    (match) => match.requests && match.requests.length > 0
  );

  return (
    <div className="table-container">
      <MuiTypography variant="h6">Match Requests</MuiTypography>
      <MuiTable className="mui-table-two-columns">
        <thead>
          <tr>
            <th>User</th>
            <th>Approve/Reject</th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.length === 0 ? (
            <tr>
              <td colSpan={2}>No matches found</td>
            </tr>
          ) : hasAnyRequests ? (
            currentRequests.flatMap((match) =>
              match.requests && match.requests.length > 0
                ? match.requests.map((request: any) => (
                    <tr key={request.requestId}>
                      <td>{request.user}</td>
                      <td>
                        <MuiButton
                          variant="contained"
                          onClick={() => onApprove(match._id, request.requestId)}
                        >
                          Approve
                        </MuiButton>
                        <MuiButton
                          variant="contained"
                          color="error"
                          onClick={() => onReject(match._id, request.requestId)}
                        >
                          Reject
                        </MuiButton>
                      </td>
                    </tr>
                  ))
                : []
            )
          ) : (
            <tr>
              <td colSpan={2}>No requests</td>
            </tr>
          )}
        </tbody>
      </MuiTable>

      <div className="pagination-buttons">
        <MuiButton variant="outlined" onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </MuiButton>
        <MuiButton variant="outlined" onClick={handleNextPage} disabled={currentRequests.length < limit}>
          Next
        </MuiButton>
      </div>
    </div>
  );
};
