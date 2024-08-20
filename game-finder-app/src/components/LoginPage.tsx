import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "firebase/firestore";
import {MuiCard} from "@ozlievano/fabric";
import './loginpage.css'
export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
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
      <button onClick={logIn}>Log In</button>
      <Link to="/create-account" className="sign-up">Don't have an account? Create one here.</Link>
      </MuiCard>
    </div>
  );
};
