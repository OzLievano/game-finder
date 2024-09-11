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