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

// Accept a match request
matchRouter.put("/match/:id/accept", async (req, res) => {
  const { id } = req.params;
  const { requestId } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid match ID");
  }

  try {
    const match = await db.collection("matches").findOne({ _id: new ObjectId(id) });
    if (!match) {
      return res.status(404).send("Match not found");
    }

    if (match.requests.length > 0) {
      const request = match.requests.find(
        (req) => req.requestId === requestId
      );

      if (request) {
        await db.collection("matches").updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              gameStatus: "accepted",
              opponent: request.user,
              requestId: request.requestId,
              requests: [],
            },
          }
        );
        return res.json({ message: "Match accepted", match });
      } else {
        return res.status(400).send("Invalid request ID or user");
      }
    } else {
      return res.status(400).send("No requests to accept");
    }
  } catch (error) {
    console.error("Error accepting match:", error);
    return res.status(500).send("Internal Server Error");
  }
});

matchRouter.put("/match/:id/schedule", async (req, res) => {
  const { id } = req.params;
  console.log('Received request body:', req.body);

  const { gameStatus, userName } = req.body;
  console.log('userName', userName)
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid match ID");
  }

  try {
    const match = await db.collection("matches").findOne({ _id: new ObjectId(id) });
    if (!match) {
      return res.status(404).send("Match not found");
    }

    if (gameStatus === "pending" && match.createdBy !== userName) {
      const hasUserAlreadyRequested = match.requests.some(
        (request) => request.user === userName
      );

      if (!hasUserAlreadyRequested) {
        const newRequestId = uuidv4();
        const newRequest = { requestId: newRequestId, user: userName };
        match.requests.push(newRequest);

        const updateResult = await db.collection("matches").updateOne(
          { _id: new ObjectId(id) },
          { $set: { requests: match.requests } }
        );

        if (updateResult.modifiedCount === 0) {
          return res.status(500).send("Failed to schedule match request");
        }

        return res.json(match);
      } else {
        return res.status(400).send("You already requested a match with this user");
      }
    }

    return res.status(400).send("Invalid game status or user");
  } catch (error) {
    console.error("Error scheduling match request:", error);
    return res.status(500).send("Internal Server Error");
  }
});



// Reject a match request
matchRouter.put("/match/:id/reject", async (req, res) => {
  const { id } = req.params;
  const { requestId } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid match ID");
  }

  try {
    const updateResult = await db.collection("matches").updateOne(
      { _id: new ObjectId(id) },
      { $pull: { requests: { requestId: requestId } } }
    );

    console.log("Update result:", updateResult);
    console.log("Query executed:", {
      _id: new ObjectId(id),
      $pull: { requests: { requestId: requestId } }
    });

    if (updateResult.matchedCount === 1 && updateResult.modifiedCount === 0) {
      return res.status(404).send("Request not found or already removed.");
    }

    const updatedMatch = await db.collection("matches").findOne({ _id: new ObjectId(id) });
    console.log("Updated match:", JSON.stringify(updatedMatch, null, 2));

    return res.json(updatedMatch);
  } catch (error) {
    console.error("Error rejecting match request:", error);
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
