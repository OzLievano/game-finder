import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {MuiCard} from "@ozlievano/fabric";
import './createaccountpage.css';

export const CreateAccountPage = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const createAccount = async () => {
    try {
      if (password !== confirmPassword) {
        setError("Password and confirm password do not match");
        return;
      }
      const userCredentials = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password
      );
      await updateProfile(userCredentials.user, {
        displayName: displayName,
      });
      navigate("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className='create-account-container'>
      <h1>Create Account</h1>
      {error && <p className="error">{error}</p>}
      <MuiCard className='create-account-card'>
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
        User Name:
        <input
          type="displayName"
          value={displayName}
          placeholder="Display Name"
          onChange={(e) => setDisplayName(e.target.value)}
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
      <label>
        Confirm Password:
        <input
          type="password"
          value={confirmPassword}
          placeholder="Re-enter your password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </label>
      <button onClick={createAccount}>Create Account </button>
      <Link to="/">Already have an account? Log in here.</Link>
      </MuiCard>
    </div>
  );
};
