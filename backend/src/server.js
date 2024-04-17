import express from "express";
import fs from "fs";
import admin from "firebase-admin";
import { MongoClient } from "mongodb";
import "dotenv/config";

import { db, connectToDB } from "./db.js";

import matchRouter from "./routes/MatchRouter.js";

const app = express();
app.use(express.json());
// Load credentials from file
const credentials = JSON.parse(fs.readFileSync("./hidden.json"));
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

app.use("/api", matchRouter);

const PORT = 8000;

connectToDB(() => {
  console.log("Successfully connected to Database");
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
  //need to host mongoDB somewhere as well..
  //mongoDB atlast software easy to work with
});
