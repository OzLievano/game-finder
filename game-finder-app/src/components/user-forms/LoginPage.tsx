import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {MuiCard} from "@ozlievano/fabric";
import './loginpage.css'
import {logIn} from "./users.api";
export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await logIn({email, password})
      navigate("/matches");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Log In</h1>
      {error && <p className="error">{error}</p>}
      <MuiCard className="login-card">
      <label>
        Email:
        <input
          type="email"
          value={email}
          placeholder="Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
      Password:
        <input
          type="password"
          value={password}
          placeholder="Your password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button onClick={handleLogin}>Log In</button>
      <Link to="/create-account" className="sign-up">Don't have an account? Create one here.</Link>
      </MuiCard>
    </div>
  );
};
