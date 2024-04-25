import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const CreateAccountPage = () => {
  const [email, setEmail] = useState("");
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
      await createUserWithEmailAndPassword(getAuth(), email, password);
      navigate("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
      <h1>Create Account</h1>
      {error && <p className="error">{error}</p>}
      <label>
        <input
          type="email"
          value={email}
          placeholder="Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        <input
          type="password"
          value={password}
          placeholder="Your password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label>
        <input
          type="password"
          value={confirmPassword}
          placeholder="Re-enter your password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </label>
      <button onClick={createAccount}>Create Account </button>
      <Link to="/login">Already have an account? Log in here.</Link>
    </>
  );
};
