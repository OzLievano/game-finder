import { MuiButton, MuiTable, MuiTypography } from "@ozlievano/fabric";
import { MatchRequests } from "./matches.api";

interface MatchRequestsTableProps {
  matchRequests: MatchRequests;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export const MatchRequestsTable = ({ matchRequests, onApprove, onReject }: MatchRequestsTableProps) => {
  const hasAnyRequests = matchRequests.some(
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
          {matchRequests.length === 0 ? (
            <tr>
              <td colSpan={2}>No matches found</td>
            </tr>
          ) : hasAnyRequests ? (
            matchRequests.flatMap((match) =>
              match.requests && match.requests.length > 0
                ? match.requests.map((request: any) => (
                    <tr key={request.requestId}>
                      <td>{request.user}</td>
                      <td>
                        <MuiButton
                          variant="contained"
                          onClick={() => onApprove(request.requestId)}
                        >
                          Approve
                        </MuiButton>
                        <MuiButton
                          variant="contained"
                          color="error"
                          onClick={() => onReject(request.requestId)}
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
    </div>
  );
};