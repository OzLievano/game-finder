import express from "express";
import { db } from "../db.js";

const matchRouter = express.Router();
matchRouter.use(express.json());

matchRouter.get("/openMatchList", async (req, res) => {
  const { displayName } = req.user;

  try {
    const matches = await db
      .collection("matches")
      .find({ gameStatus: "open", createdBy: { $ne: displayName } })
      .toArray();
    res.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).send("Internal Server Error");
  }
});

matchRouter.get("/matchList", async (req, res) => {
  const { displayName } = req.user;
  try {
    const matches = await db
      .collection("matches")
      .find({ createdBy: displayName })
      .toArray();
    res.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).send("Internal Server Error");
  }
});

matchRouter.post("/match", async (req, res) => {
  const { createdBy, timeZone, matchType, format, language, status } = req.body;

  const newMatch = {
    createdBy: createdBy,
    timezone: timeZone,
    matchType: matchType,
    format: format,
    language: language,
    gameStatus: status,
    requests: [],
  };

  try {
    const matches = await db.collection("matches").insertOne(newMatch);

    res.json(newMatch);
  } catch (error) {
    console.error("Error creating a new match:", error);
    res.status(500).send("An error occurred while creating a new match");
  }
});

matchRouter.put("/match/:id", async (req, res) => {
  const { id } = req.params;
  const { requestId } = req.body;

  const match = await db.collection("matches").findOne({ _id: id });
  if (match) {
    if (req.body.gameStatus === "accepted" && match.requests.length > 0) {
      const request = match.requests.find((req) => req.requestId === requestId);
      if (request) {
        match.gameStatus = "accepted";
        match.opponent = request.user;
        match.requestId = request.requestId;
        match.requests = []; // remove all requests after acceptance
        await match.save();
        res.json(match);
      } else {
        res.sendStatus(400).send("Invalid request ID");
      }
    } else {
      res.sendStatus(400).send("Invalid game status");
    }
  } else {
    res.sendStatus(404).send("Match not found");
  }
});

matchRouter.get("/match/:id/requests", async (req, res) => {
  const { id } = req.params;
  const match = await db.collection("matches").findOne({ _id: id });
  if (match) {
    if (match.opponent) {
      // If the match already has an opponent, remove all requests
      match.requests = [];
      await match.save();
    }
    res.json(match.requests);
  } else {
    res.sendStatus(404).send("Match not found");
  }
});

export default matchRouter;
