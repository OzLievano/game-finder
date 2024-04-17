import express from "express";
import { db } from "../db.js";

const matchRouter = express.Router();

// Route to get a list of matches
matchRouter.get("/matchList", async (req, res) => {
  try {
    // Get the database instance from the MongoClient
    const matches = await db.collection("matches").find({}).toArray();
    res.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to create a new match
matchRouter.post("/match", (req, res) => {
  res.send("This is an API to create a new match");
});

// Route to update an existing match
matchRouter.put("/match/:id", (req, res) => {
  res.send("This is an API to update the created match");
});

export default matchRouter;
