import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";
import { NotFoundPage } from "./NotFoundPage";
import { CreateAccountPage } from "./components/user-forms/CreateAccountPage";
import { LoginPage } from "./components/user-forms/LoginPage";
import { MatchTable } from "./components/match-tables/MatchTable";
import { CreateNewMatch } from "./components/CreateNewMatch";
import { ProfilePage } from "./components/ProfilePage";
import { NotificationProvider } from "./components/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <div className="App">
          <NavigationBar />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/matches" element={<MatchTable />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/create-match" element={<CreateNewMatch />} />
            <Route path="/user-profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
