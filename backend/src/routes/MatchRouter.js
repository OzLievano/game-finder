import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../db.js";
import authenticate from "./authenticate.js";

const matchRouter = express.Router();
matchRouter.use(express.json());
matchRouter.use(authenticate);
// Get a list of open matches, excluding those created by the current user
matchRouter.get("/openMatchList", async (req, res) => {
  const { displayName } = req.user;
  console.log(`displayName: ${displayName}`);

  try {
    const query = { gameStatus: "open", createdBy: { $ne: displayName } };
    console.log(`Query: ${JSON.stringify(query)}`);

    const matches = await db.collection("matches").find(query).toArray();
    console.log(`Matches found: ${matches.length}`);
    res.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get a list of matches created by the current user
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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new match
matchRouter.post("/match", async (req, res) => {
  const { createdBy, timeZone, matchType, format, language, status } = req.body;
  console.log(req.body);
  const newMatch = {
    createdBy,
    timezone: timeZone,
    matchType,
    format,
    language,
    gameStatus: status,
    requests: [],
  };

  try {
    const result = await db.collection("matches").insertOne(newMatch);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating a new match:", error);
    res.status(500).send("An error occurred while creating a new match");
  }
});

// Update match by ID
matchRouter.put("/match/:id", async (req, res) => {
  const { id } = req.params;
  const { requestId, userId, gameStatus } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid match ID");
  }

  try {
    const match = await db
      .collection("matches")
      .findOne({ _id: new ObjectId(id) });
    if (!match) {
      return res.status(404).send("Match not found");
    }

    if (gameStatus === "accepted" && match.requests.length > 0) {
      const request = match.requests.find(
        (req) => req.requestId === requestId && req.user === userId
      );
      if (request) {
        match.gameStatus = "accepted";
        match.opponent = request.user;
        match.requestId = request.requestId;
        match.requests = [];
        await db
          .collection("matches")
          .updateOne({ _id: new ObjectId(id) }, { $set: match });
        return res.json(match);
      } else {
        return res.status(400).send("Invalid request ID or user");
      }
    } else if (gameStatus === "pending" && match.createdBy !== userId) {
      const newRequest = { requestId, user: userId };
      match.requests.push(newRequest);
      await db
        .collection("matches")
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { requests: match.requests } }
        );
      return res.json(match);
    } else {
      return res.status(400).send("Invalid game status or user");
    }
  } catch (error) {
    console.error("Error updating match:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Get requests for a specific match by ID
matchRouter.get("/match/:id/requests", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid match ID");
  }

  try {
    const match = await db
      .collection("matches")
      .findOne({ _id: new ObjectId(id) });
    if (!match) {
      return res.status(404).send("Match not found");
    }

    if (match.opponent) {
      // If the match already has an opponent, remove all requests
      match.requests = [];
      await db
        .collection("matches")
        .updateOne({ _id: new ObjectId(id) }, { $set: { requests: [] } });
    }
    res.json(match.requests);
  } catch (error) {
    console.error("Error fetching match requests:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default matchRouter;
