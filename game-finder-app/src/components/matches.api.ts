import { getAuth } from "firebase/auth";

type Request = {
  requestId: string;
  user: string;
};

export type Match = {
  _id: string;
  createdBy: string;
  timezone: string;
  matchType: string;
  format: string;
  language: string;
  gameStatus: string;
  opponent: string | null;
  requests: Request[];
};

export type Matches = Match[];

export type MatchRequests = Match[];

export type MatchFormState = {
  matchType: string;
  format: string;
  timezone: number | string;
  language: string;
  gameStatus: string;
  createdBy: string;
};


export const createNewMatch = async (formState: MatchFormState) => {
  try {
    const idToken = await getAuth().currentUser?.getIdToken();
    if (!idToken) {
      throw new Error("User not authenticated");
    }

    const response = await fetch("api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        matchType: formState.matchType,
        format: formState.format,
        timezone: formState.timezone,
        language: formState.language,
        createdBy: getAuth().currentUser?.displayName,
        gameStatus: formState.gameStatus,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};


export const scheduleMatch = async (id: string) => {
  try {
    const idToken = await getAuth().currentUser?.getIdToken();
    const user = await getAuth().currentUser;
    const response = await fetch(`api/match/${id}/schedule`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        gameStatus: "pending",
        userName: user?.displayName,
      }),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to update match ${id}`);
    }
  } catch (error: any) {
    console.error("Error scheduling match:", error);
  }
}