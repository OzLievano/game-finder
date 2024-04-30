import { useEffect, useState } from "react";
import { MuiBox, MuiButton, MuiTypography } from "@ozlievano/fabric";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type FormMatchData = {
  matchType: string;
  matchFormat: string;
  matchTime: Date | string;
  language: string;
  status: string;
  createdBy: string;
};

export const CreateNewMatch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formState, setFormState] = useState<FormMatchData>({
    matchType: "",
    matchFormat: "",
    matchTime: "",
    language: "",
    status: "open",
    createdBy: user?.email,
  });
  console.log("formState", formState);
  console.log(user);

  const handleCreateNewMatch = () => {
    fetch("api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        matchType: formState.matchType,
        format: formState.matchFormat,
        timezone: formState.matchTime,
        language: formState.language,
        createdBy: user.displayName,
        gameStatus: formState.status,
      }),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
    navigate("/");
  };

  return (
    <MuiBox component="form" noValidate autoComplete="off">
      <label htmlFor="match-type">
        <MuiTypography>Match Type</MuiTypography>
        <select name="match-type" id="match-type-select">
          <option value="">--Please choose an option--</option>
          <option value="Matched Play">Competitive</option>
          <option value="Casual">Casual</option>
        </select>
      </label>
      <label htmlFor="match-format">
        <MuiTypography>Match Format</MuiTypography>
        <select name="match-format" id="match-format-select">
          <option value="">--Please choose an option--</option>
          <option value="Matched Play">Matched Play</option>
          <option value="Casual">Narrative Play</option>
        </select>
      </label>
      <label htmlFor="match-time">
        <MuiTypography>Choose a time for your match:</MuiTypography>
        <input
          type="datetime-local"
          id="match-time"
          name="match-time"
          value="2018-06-12T19:30"
          min="2024-06-07T00:00"
          max="2024-12-14T00:00"
        />
      </label>
      <label>
        <MuiTypography>Enter your language preference</MuiTypography>
        <input type="text" placeholder="Language Preference" />
      </label>
      <p></p>
      <MuiButton onClick={handleCreateNewMatch} variant="contained">
        <MuiTypography>Submit New Match</MuiTypography>
      </MuiButton>
    </MuiBox>
  );
};
function then(arg0: (response: any) => any) {
  throw new Error("Function not implemented.");
}
