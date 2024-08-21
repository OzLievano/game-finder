import { MuiTable, MuiTypography } from "@ozlievano/fabric";
import { Matches } from "./matches.api";

interface MatchHistoryTableProps {
  matches: Matches;
}

export const MatchHistoryTable = ({ matches }: MatchHistoryTableProps) => {
  return (
    <div className="match-table-container">
      <MuiTypography variant="h6">Match History</MuiTypography>
      <MuiTable className='mui-table'>
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
          {matches && matches.length > 0 ? (
            matches.map((match) => (
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
    </div>
  );
};