import express from "express";
import fs from "fs";
import path from "path";
import admin from "firebase-admin";
import cors from "cors";
import "dotenv/config";

import { db, connectToDB } from "./db.js";
import matchRouter from "./routes/MatchRouter.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load credentials from file
const credentials = JSON.parse(fs.readFileSync("../hidden.json"));
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../build")));

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.use(async (req, res, next) => {
  //next needs to be called when we are done processing middleware
  const { authToken } = req.headers;
  if (authToken) {
    try {
      req.user = await admin.auth().verifyIdToken(authToken);
    } catch (error) {
      return res.sendStatus(400);
    }
  }

  req.user = req.user || {};

  next();
});

app.use("/api", matchRouter);

const PORT = process.env.PORT || 8000;

connectToDB(() => {
  console.log("Successfully connected to Database");
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
  //need to host mongoDB somewhere as well..
  //mongoDB atlast software easy to work with
});
