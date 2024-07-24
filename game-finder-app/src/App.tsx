import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { NavigationBar } from "./components/NavigationBar";
import { NotFoundPage } from "./NotFoundPage";
import { CreateAccountPage } from "./components/CreateAccountPage";
import { LoginPage } from "./components/LoginPage";
import { MatchTable } from "./components/MatchTable";
import { CreateNewMatch } from "./components/CreateNewMatch";
import { ProfilePage } from "./components/ProfilePage";
import { NotificationProvider } from "./components/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <div className="App">
          <NavigationBar />
          {/* //TODO:add actual style */}
          <br />
          <br />
          <br />
          <Routes>
            <Route path="/" element={<MatchTable />} />
            <Route path="/login" element={<LoginPage />} />
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
