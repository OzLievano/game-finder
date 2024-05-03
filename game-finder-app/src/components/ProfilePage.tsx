import { MuiButton, MuiCard, MuiTable, MuiTypography } from "@ozlievano/fabric";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { Matches } from "./matches.api";

export const ProfilePage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Matches | []>([]);
  const [matchRequests, setMatchRequests] =
    useState<{ [key: string]: any }[]>();

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
    const loadMatchRequests = async (matchIds: any) => {
      try {
        const requestsData: { [key: string]: any }[] = await Promise.all(
          matchIds.map(async (id: any) => {
            const response = await fetch(`api/match/request/${id}`);
            console.log("response", response);
            return response.json();
          })
        );
        setMatchRequests(requestsData);
      } catch (error) {
        console.error("Error fetching matches:", error);
        // Handle errors appropriately
      }
    };
    loadMatchList();
    const matchIds = matches.map((match) => match._id); // Assuming _id is the match ID
    loadMatchRequests(matchIds);
  }, []);

  console.log("matchRequests", matchRequests);

  const handleSignOut = () => {
    // Sign out
    getAuth()
      .signOut()
      .then(() => {
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };
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
        {matchRequests ? (
          matchRequests.map((request) => {
            return <h1> request </h1>;
          })
        ) : (
          <></>
        )}
      </MuiCard>
      <h3>Match History</h3>
      <MuiTable>
        <tr>
          <th> Time Zone </th>
          <th> Match Type </th>
          <th> Format </th>
          <th> Language </th>
          <th> Status </th>
          <th> Opponent </th>
        </tr>
        {matches ? (
          matches.map((match) => {
            return (
              <tr>
                <td>{match.timezone}</td>
                <td>{match.matchType}</td>
                <td>{match.format}</td>
                <td>{match.language}</td>
                <td>{match.gameStatus}</td>
                <td>{match.opponent}</td>
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
