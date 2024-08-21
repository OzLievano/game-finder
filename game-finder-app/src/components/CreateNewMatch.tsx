import { useEffect, useState } from "react";
import { MuiBox, MuiButton, MuiTypography } from "@ozlievano/fabric";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "./NotificationContext";
import './createnewmatch.css';

type FormMatchData = {
  matchType: string;
  format: string;
  timezone: number | string;
  language: string;
  gameStatus: string;
  createdBy: string;
};

export const CreateNewMatch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [formState, setFormState] = useState<FormMatchData>({
    matchType: "",
    format: "",
    timezone: "",
    language: "",
    gameStatus: "open",
    createdBy: "",
  });
  useEffect(() => {
    // Update createdBy once user is populated
    if (user) {
      setFormState((prevState) => ({
        ...prevState,
        createdBy: user.displayName || "", // Set createdBy to user's displayName if available
      }));
    }
  }, [user]);

  const handleFormValues = (e: any) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const createNewMatch = async () => {
    const idToken = await user.getIdToken();
    await fetch("api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        matchType: formState.matchType,
        format: formState.format,
        timezone: formState.timezone,
        language: formState.language,
        createdBy: user.displayName,
        gameStatus: formState.gameStatus,
      }),
    })
      .then((response: any) => {
        console.log(response);
        showNotification("Match created successfully", "success");
        response.json();
      })
      .catch((error) => {
        showNotification(error.message, "error");
        console.error("Error:", error);
      });
    navigate("/matches");
  };

  return (
    <div className='create-match-container'>
    <MuiBox component="form" noValidate autoComplete="off" className="create-match-form">
      <div className="form-group">
      <label htmlFor="match-type">
        <MuiTypography>Match Type</MuiTypography>
        <select
          name="matchType"
          id="match-type-select"
          value={formState.matchType}
          onChange={handleFormValues}
        >
          <option value="">--Please choose an option--</option>
          <option value="Spearhead">Spearhead</option>
          <option value="Pitched Battles">Pitched Battles</option>
        </select>
      </label>
      <label htmlFor="match-format">
        <MuiTypography>Match Format</MuiTypography>
        <select
          name="format"
          id="match-format-select"
          value={formState.format}
          onChange={handleFormValues}
        >
          <option value="">--Please choose an option--</option>
          <option value="Ranked">Ranked</option>
          <option value="Casual">Casual</option>
        </select>
      </label>
      <label htmlFor="match-time">
        <MuiTypography>Choose a time for your match:</MuiTypography>
        <input
          type="datetime-local"
          id="match-time"
          name="timezone"
          min="2024-06-07T00:00"
          max="2024-12-14T00:00"
          value={formState.timezone}
          onChange={handleFormValues}
        />
      </label>
      <label>
        <MuiTypography>Enter your language preference</MuiTypography>
        <input
          type="text"
          placeholder="Language Preference"
          name="language"
          value={formState.language}
          onChange={handleFormValues}
        />
      </label>
      </div>
      <MuiButton onClick={createNewMatch} variant="contained">
        <MuiTypography>Submit New Match</MuiTypography>
      </MuiButton>
    </MuiBox>
    </div>
  );
};
