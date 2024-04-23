import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { NavigationBar } from "./components/NavigationBar";
import { LoginPage } from "./components/LoginPage";
import { MatchTable } from "./components/MatchTable";

function App() {
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
          <Route path="/" element={<MatchTable />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
