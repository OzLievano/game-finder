import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../db.js";
import authenticate from "./authenticate.js";
import { v4 as uuidv4 } from "uuid";

const matchRouter = express.Router();
matchRouter.use(express.json());
matchRouter.use(authenticate);
// Get a list of open matches, excluding those created by the current user
matchRouter.get("/openMatchList", async (req, res) => {
  const { name } = req.user;

  console.log("name:", name);
  try {
    const query = { gameStatus: "open", createdBy: { $ne: name } };
    const matches = await db.collection("matches").find(query).toArray();
    console.log(matches);
    res.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get a list of matches created by the current user
matchRouter.get("/matchList", async (req, res) => {
  const { name } = req.user;
  try {
    const matches = await db
      .collection("matches")
      .find({ createdBy: name })
      .toArray();
    res.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new match
matchRouter.post("/match", async (req, res) => {
  const { createdBy, timezone, matchType, format, language, gameStatus } =
    req.body;
  const newMatch = {
    createdBy,
    timezone,
    matchType,
    format,
    language,
    gameStatus,
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
        await db.collection("matches").updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              gameStatus: match.gameStatus,
              opponent: match.opponent,
              requestId: match.requestId,
              requests: match.requests,
            },
          }
        );
        return res.json(match);
      } else {
        return res.status(400).send("Invalid request ID or user");
      }
    } else if (gameStatus === "pending" && match.createdBy !== userId) {
      const hasUserAlreadyRequested = match.requests.some(
        (request) => request.user === req.user.name
      );
      if (!hasUserAlreadyRequested) {
        const newRequestId = uuidv4();
        const newRequest = { requestId: newRequestId, user: req.user.name };
        match.requests.push(newRequest);
        await db
          .collection("matches")
          .updateOne(
            { _id: new ObjectId(id) },
            { $set: { requests: match.requests } }
          );
        return res.json(match);
      } else {
        return res
          .status(400)
          .send("You already requested a match with this user");
      }
    } else {
      return res.status(400).send("Invalid game status or user");
    }
  } catch (error) {
    console.error("Error updating match:", error);
    return res.status(500).send("Internal Server Error");
  }
});

matchRouter.get("/allMatchRequests", async (req, res) => {
  const { name } = req.user;

  if (!name) {
    return res.status(400).send("User not authenticated");
  }

  try {
    console.log("Fetching matches for user:", name);

    const matchesWithRequests = await db
      .collection("matches")
      .aggregate([
        {
          $match: {
            createdBy: name,
          },
        },
        {
          $project: {
            _id: 1,
            createdBy: 1,
            timezone: 1,
            matchType: 1,
            format: 1,
            language: 1,
            gameStatus: 1,
            requests: {
              $filter: {
                input: "$requests",
                as: "request",
                cond: { $ne: ["$$request.requestId", null] }, // Filter out null requests if necessary
              },
            },
          },
        },
      ])
      .toArray();

    console.log("Matches with requests:", matchesWithRequests);
    res.json(matchesWithRequests);
  } catch (error) {
    console.error("Error fetching match requests:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default matchRouter;
