import { useEffect, useState } from "react";
import { MuiBox, MuiButton, MuiTypography } from "@ozlievano/fabric";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "./NotificationContext";
import './createnewmatch.css';
import { createNewMatch } from "./matches.api";
import {MatchFormState} from '../components/match-tables/matches.types'

/* TODO: need to do from validation to prevent users from creating new match without 
    values
  */

export const CreateNewMatch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [formState, setFormState] = useState<MatchFormState>({
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

  const handleCreateNewMatch = async () => {
    try {
      if (!user) {
        throw new Error("User is not logged in");
      }

      await createNewMatch(formState);
      showNotification("Match created successfully", "success");
      navigate("/matches");
    } catch (error: any) {
      showNotification(error.message, "error");
      console.error("Error creating match:", error);
    }
  };

  return (
    <div className='create-match-container'>
    <MuiBox component="form" noValidate autoComplete="off" className="create-match-form">
      <div className="form-group">
      <label htmlFor="match-type" aria-required>
        <MuiTypography>Match Type</MuiTypography>
        <select
          name="matchType"
          id="match-type-select"
          value={formState.matchType}
          onChange={handleFormValues}
          required
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
          required
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
          required
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
          required
        />
      </label>
      </div>
      <MuiButton onClick={handleCreateNewMatch} variant="contained">
        <MuiTypography>Submit New Match</MuiTypography>
      </MuiButton>
    </MuiBox>
    </div>
  );
};
