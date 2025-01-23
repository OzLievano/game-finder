import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../db.js";
import authenticate from "./authenticate.js";
import { v4 as uuidv4 } from "uuid";
import sendMatchNotificationEmail from "../functions/index.js";

const matchRouter = express.Router();
matchRouter.use(express.json());
matchRouter.use(authenticate);
// Get a list of open matches, excluding those created by the current user
// Get a list of open matches, excluding those created by the current user
matchRouter.get("/openMatchList", async (req, res) => {
  const { name } = req.user;
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 matches per page

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  try {
    const query = { gameStatus: "open", createdBy: { $ne: name } };
    const totalMatches = await db.collection("matches").countDocuments(query);
    const matches = await db
      .collection("matches")
      .find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .toArray();

    res.json({
      matches,
      totalMatches,
      totalPages: Math.ceil(totalMatches / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get a list of matches created by the current user
matchRouter.get("/matchList", async (req, res) => {
  const { name } = req.user;
  const { page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  try {
    const totalMatches = await db
      .collection("matches")
      .countDocuments({ createdBy: name });
    const matches = await db
      .collection("matches")
      .find({ createdBy: name })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .toArray();

    res.json({
      matches,
      totalMatches,
      totalPages: Math.ceil(totalMatches / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new match
matchRouter.post("/match", async (req, res) => {
  const {
    createdBy,
    timezone,
    matchType,
    format,
    language,
    gameStatus,
    email,
  } = req.body;
  const newMatch = {
    createdBy,
    timezone,
    matchType,
    format,
    language,
    gameStatus,
    requests: [],
    email,
  };
  console.log(newMatch);

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
    const match = await db
      .collection("matches")
      .findOne({ _id: new ObjectId(id) });

    if (!match) {
      return res.status(404).send("Match not found");
    }

    // Log the match before processing the request
    console.log("Match before accepting:", match);

    if (match.requests.length > 0) {
      const request = match.requests.find((req) => req.requestId === requestId);

      if (request) {
        // Log the request being accepted
        console.log("Request being accepted:", request);

        // Define the Discord channel link (this can be dynamic, but for now, we're using a placeholder)
        const discordChannelLink = "https://discord.gg/gjgX9M7G"; // Replace with your actual Discord invite link
        console.log("match", match);
        console.log("request", request);
        // Retrieve player details (email, display names)
        const playerAEmail = match.email; // Assuming you have these in your match object
        const playerBEmail = request.userEmail; // Assuming you have these in your request object
        const playerAName = match.createdBy; // Assuming you have these in your match object
        const playerBName = request.user; // Assuming you have these in your request object

        // Send email notifications to both players
        await sendMatchNotificationEmail(
          playerAEmail,
          playerBEmail,
          discordChannelLink,
          playerAName,
          playerBName
        );

        // Update the match document with the accepted status and clear the requests
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

        // Log the match after accepting the request
        const updatedMatch = await db
          .collection("matches")
          .findOne({ _id: new ObjectId(id) });

        console.log("Updated match after accepting:", updatedMatch);

        return res.json({ message: "Match accepted", match: updatedMatch });
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
  const { gameStatus, userName, email } = req.body;

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

    // Add log to check current match details before scheduling
    console.log("Current match details:", match);

    if (gameStatus === "pending" && match.createdBy !== userName) {
      const hasUserAlreadyRequested = match.requests.some(
        (request) => request.user === userName
      );

      // Log whether the user has already requested a match or not
      console.log("Has user already requested:", hasUserAlreadyRequested);

      if (!hasUserAlreadyRequested) {
        const newRequestId = uuidv4();
        const newRequest = {
          requestId: newRequestId,
          user: userName,
          userEmail: email,
        };

        // Log the request being added
        console.log("Request being added:", newRequest);

        match.requests.push(newRequest);

        const updateResult = await db
          .collection("matches")
          .updateOne(
            { _id: new ObjectId(id) },
            { $set: { requests: match.requests } }
          );

        if (updateResult.modifiedCount === 0) {
          return res.status(500).send("Failed to schedule match request");
        }

        // Log the updated match details after request is added
        console.log("Updated match after adding request:", match);

        return res.json(match);
      } else {
        return res
          .status(400)
          .send("You already requested a match with this user");
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
    const updateResult = await db
      .collection("matches")
      .updateOne(
        { _id: new ObjectId(id) },
        { $pull: { requests: { requestId: requestId } } }
      );

    // Log the update result to see if it was successful
    console.log("Update result for reject:", updateResult);
    console.log("Query executed for reject:", {
      _id: new ObjectId(id),
      $pull: { requests: { requestId: requestId } },
    });

    if (updateResult.matchedCount === 1 && updateResult.modifiedCount === 0) {
      return res.status(404).send("Request not found or already removed.");
    }

    const updatedMatch = await db
      .collection("matches")
      .findOne({ _id: new ObjectId(id) });

    // Log the updated match after rejecting the request
    console.log(
      "Updated match after rejection:",
      JSON.stringify(updatedMatch, null, 2)
    );

    return res.json(updatedMatch);
  } catch (error) {
    console.error("Error rejecting match request:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Get all match requests for the current user with pagination
matchRouter.get("/allMatchRequests", async (req, res) => {
  const { name } = req.user; // Logged-in user's name
  const { page = 1, limit = 20 } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (!name) {
    return res.status(400).send("User not authenticated");
  }

  try {
    const totalMatches = await db.collection("matches").countDocuments({
      createdBy: name, // Matches created by the user
      "requests.user": { $ne: name }, // Exclude requests made by the user themselves
    });

    const matchesWithRequests = await db
      .collection("matches")
      .aggregate([
        {
          $match: {
            createdBy: name, // Matches created by the user
            "requests.user": { $ne: name }, // Only include requests not made by the user
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
            email: 1,
            gameStatus: 1,
            requests: 1, // Include the requests array
          },
        },
        {
          $skip: (pageNum - 1) * limitNum,
        },
        {
          $limit: limitNum,
        },
      ])
      .toArray();

    res.json({
      matchesWithRequests,
      totalMatches,
      totalPages: Math.ceil(totalMatches / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Error fetching match requests:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default matchRouter;
