type Request = {
  requestId: string;
  user: string;
};

export type Match = {
  _id: number;
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
