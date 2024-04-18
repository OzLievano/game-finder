import express from "express";
import { db } from "../db.js";

const matchRouter = express.Router();
matchRouter.use(express.json());

matchRouter.get("/matchList", async (req, res) => {
  try {
    const matches = await db.collection("matches").find({}).toArray();
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
  };

  try {
    const matches = await db.collection("matches").insertOne(newMatch);

    res.json(newMatch);
  } catch (error) {
    console.error("Error creating a new match:", error);
    res.status(500).send("An error occurred while creating a new match");
  }
});

matchRouter.put("/match/:id", (req, res) => {
  res.send(
    "This is an API to update the created match, mainly we will want to update the status "
  );
});

export default matchRouter;
