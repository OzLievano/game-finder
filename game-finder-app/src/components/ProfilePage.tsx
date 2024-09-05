import { MuiButton, MuiCard, MuiTable, MuiTypography } from "@ozlievano/fabric";
import { useState, useEffect, useMemo } from "react";
import { getAuth } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { MatchRequests, Matches } from "./matches.api";
import { MatchRequestsTable } from './MatchRequestsTable';
import { MatchHistoryTable } from './MatchHistoryTable';
import {useNotification} from "./NotificationContext";

interface ProfilePageProps {
  matchRequests: MatchRequests;
}

export const ProfilePage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Matches | []>([]);
  const [matchRequests, setMatchRequests] = useState<MatchRequests | []>([]);
  const { showNotification } = useNotification();
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
  
  const handleApprove = async (matchId: string, requestId: string) => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/match/${matchId}/accept`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ requestId }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        showNotification(errorMessage, "error");
        throw new Error("Failed to update match request");
      }
  
      const { match } = await response.json();
  
      // Update client state to reflect server-side changes
      setMatchRequests(prevRequests =>
        prevRequests.map(existingMatch =>
          existingMatch._id === match._id
            ? {
                ...existingMatch,
                gameStatus: match.gameStatus,
                opponent: match.opponent,
                requests: [] // Requests are cleared as they're now accepted
              }
            : existingMatch
        )
      );
  
      showNotification("Match request approved successfully", "success");
    } catch (error: any) {
      console.error("Error approving match request:", error);
      showNotification(error.message, "error");
    }
  };

const handleReject = async (matchId: string, requestId: string) => {
  console.log("Reject request for match:", matchId, "with requestId:", requestId);
  try {
    const idToken = await user.getIdToken();
    const response = await fetch(`/api/match/${matchId}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        requestId,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      showNotification(errorMessage, "error");
      throw new Error("Failed to reject match request");
    }

    const updatedMatch = await response.json();
    setMatchRequests(prevRequests => 
      prevRequests.map(request => 
        request._id === updatedMatch._id ? updatedMatch : request
      )
    );
    showNotification("Match request rejected successfully", "success");
  } catch (error: any) {
    console.error("Error rejecting match request:", error);
    showNotification(error.message, "error");
  }
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
