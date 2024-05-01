export type Match = {
  createdBy: string;
  timezone: string;
  matchType: string;
  format: string;
  language: string;
  gameStatus: string;
  opponent: string | null;
};

export type Matches = Match[];
