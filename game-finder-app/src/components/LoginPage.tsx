import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "firebase/firestore";
export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      navigate("/articles");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
      <h1>Log In</h1>
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
      <button onClick={logIn}>Log In</button>
      <Link to="/create-account">Don't have an account? Create one here.</Link>
    </>
  );
};
