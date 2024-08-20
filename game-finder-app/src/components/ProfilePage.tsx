import { MuiButton, MuiCard, MuiTable, MuiTypography } from "@ozlievano/fabric";
import { useState, useEffect, useMemo } from "react";
import { getAuth } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { MatchRequests, Matches } from "./matches.api";

interface ProfilePageProps {
  matchRequests: MatchRequests;
}

export const ProfilePage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Matches | []>([]);
  const [matchRequests, setMatchRequests] = useState<MatchRequests | []>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMatchList = async () => {
      try {
        if (!user) {
          throw new Error("User is not logged in");
        }
        const idToken = await user.getIdToken();
        const fetchMatches = await fetch("api/matchList", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!fetchMatches.ok) {
          throw new Error(`Fetch failed with status ${fetchMatches.status}`);
        }

        const matchData = await fetchMatches.json(); // Parse response as JSON
        setMatches(matchData);
      } catch (error) {
        console.error("Error fetching matches:", error);
        // Handle errors appropriately
      }
    };

    if (user) {
      loadMatchList();
    }
  }, [user]);

  useEffect(() => {
    const loadMatchRequests = async () => {
      try {
        if (!user) {
          throw new Error("User is not logged in");
        }
        const idToken = await user.getIdToken();
        const response = await fetch("/api/allMatchRequests", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }

        const matchData = await response.json(); // Parse response as JSON
        setMatchRequests(matchData);
      } catch (error) {
        console.error("Error fetching match requests:", error);
      }
    };

    if (user) {
      loadMatchRequests();
    }
  }, [user]);

  console.log(matchRequests);

  const handleSignOut = () => {
    getAuth()
      .signOut()
      .then(() => {
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const hasAnyRequests = useMemo(
    () =>
      matchRequests.some(
        (match) => match.requests && match.requests.length > 0
      ),
    [matchRequests]
  );

  const allEmptyRequests = useMemo(
    () =>
      !matchRequests.some(
        (match) => match.requests && match.requests.length > 0
      ),
    [matchRequests]
  );

  return (
    <div>
      <MuiCard>
        <MuiTypography variant="h5">
          User Name: {user?.displayName}
        </MuiTypography>
        <MuiTypography variant="h5">Email: {user?.email}</MuiTypography>
      </MuiCard>
      <MuiButton variant="contained" onClick={handleSignOut}>
        Sign Out
      </MuiButton>
      <MuiCard>
        <MuiTable>
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
              matchRequests.map((match) =>
                match.requests && match.requests.length > 0
                  ? match.requests.map((request: any) => (
                      <tr key={request.requestId}>
                        <td>{request.user}</td>
                        <td>
                          <MuiButton
                            variant="contained"
                            onClick={() => {
                              console.log("YEET");
                            }}
                          >
                            Approve
                          </MuiButton>
                          <MuiButton
                            variant="contained"
                            color="error"
                            onClick={() => {
                              console.log("YEET");
                            }}
                          >
                            Reject
                          </MuiButton>
                        </td>
                      </tr>
                    ))
                  : null
              )
            ) : (
              <tr>
                <td colSpan={2}>No requests</td>
              </tr>
            )}
          </tbody>
        </MuiTable>
      </MuiCard>
      <h3>Match History</h3>
      <MuiTable>
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
