import express from "express";
import fs from "fs";
import admin from "firebase-admin";
import "dotenv/config";

import matchRouter from "./routes/MatchRouter.js";

const app = express();
const credentials = JSON.parse(fs.readFileSync("./hidden.json"));
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

app.use("/api", matchRouter);

app.listen(8001, () => {
  console.log("listening on port 8001");
});
