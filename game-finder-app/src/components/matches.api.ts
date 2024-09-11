import { getAuth } from "firebase/auth";
import { getUserToken } from "./user-forms/users.utils";
import { handleError, BASE_API_URL } from "../api.utils";

export type Request = {
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
export type MatchRequests = Request[];
export type MatchFormState = {
  matchType: string;
  format: string;
  timezone: number | string;
  language: string;
  gameStatus: string;
  createdBy: string;
};

export const loadMatches = async (page: number, limit: number) => {
  try {
    const idToken = await getUserToken();
    const fetchMatches = await fetch(`${BASE_API_URL}/openMatchList?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    await handleError(fetchMatches);
    const matchData = await fetchMatches.json();
    return matchData;
  } catch (error: any) {
    console.error("Error loading matches:", error);
  }
};

export const createNewMatch = async (formState: MatchFormState) => {
  try {
    const idToken = await getUserToken();
    const response = await fetch(`${BASE_API_URL}/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        ...formState,
        createdBy: getAuth().currentUser?.displayName,
      }),
    });

    await handleError(response);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error creating match:", error);
  }
};

export const scheduleMatch = async (id: string) => {
  try {
    const idToken = await getUserToken();
    const user = getAuth().currentUser;
    const response = await fetch(`${BASE_API_URL}/match/${id}/schedule`, {
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

    await handleError(response);
  } catch (error: any) {
    console.error("Error scheduling match:", error);
  }
};
