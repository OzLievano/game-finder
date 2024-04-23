import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import {
  MuiBottomNavigation,
  MuiButton,
  MuiTable,
  MuiTypography,
} from "@ozlievano/fabric";
import { NavigationBar } from "./components/NavigationBar";
import { LoginPage } from "./components/LoginPage";

type Match = {
  createdBy: string;
  timezone: string;
  matchType: string;
  format: string;
  language: string;
  gameStatus: string;
};

type Matches = Match[];

function App() {
  const [matches, setMatches] = useState<Matches | []>([]);

  useEffect(() => {
    const loadMatchList = async () => {
      try {
        const fetchMatches = await fetch("api/matchList");
        console.log(fetchMatches);
        const matchData = await fetchMatches.json(); // Parse response as JSON
        console.log("match", matchData);
        setMatches(matchData);
      } catch (error) {
        console.error("Error fetching matches:", error);
        // Handle errors appropriately
      }
    };
    loadMatchList();
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <NavigationBar />
        //TODO: add actual style
        <br />
        <br />
        <br />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <MuiButton variant="contained">Create a New Match</MuiButton>
        <MuiTable>
          <tr>
            <th> Created By </th>
            <th> Time Zone </th>
            <th> Match Type </th>
            <th> Format </th>
            <th> Language </th>
            <th> Status </th>
          </tr>
          {matches ? (
            matches.map((match) => {
              return (
                <tr>
                  <td>{match.createdBy}</td>
                  <td>{match.timezone}</td>
                  <td>{match.matchType}</td>
                  <td>{match.format}</td>
                  <td>{match.language}</td>
                  <td>{match.gameStatus}</td>
                </tr>
              );
            })
          ) : (
            <></>
          )}
        </MuiTable>
      </div>
    </BrowserRouter>
  );
}

export default App;
