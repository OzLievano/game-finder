import { MuiButton, MuiCard, MuiTable, MuiTypography } from "@ozlievano/fabric";
import { useState, useEffect, useMemo } from "react";
import { getAuth } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { MatchRequests, Matches } from "./matches.api";
import { MatchRequestsTable } from './MatchRequestsTable';
import { MatchHistoryTable } from './MatchHistoryTable';

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
  
  const handleApprove = (requestId: string) => {
    console.log("Approve request", requestId);
    // Implement approval logic
  };

  const handleReject = (requestId: string) => {
    console.log("Reject request", requestId);
    // Implement rejection logic
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
      <MatchRequestsTable 
        matchRequests={matchRequests} 
        onApprove={handleApprove} 
        onReject={handleReject} 
      />
      <MatchHistoryTable matches={matches} />
    </div>
  );
};
