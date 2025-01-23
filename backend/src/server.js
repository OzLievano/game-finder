import express from "express";
import fs from "fs";
import path from "path";
import admin from "firebase-admin";
import cors from "cors";
import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js"; // Import Discord.js

import { db, connectToDB } from "./db.js";
import matchRouter from "./routes/MatchRouter.js";
import { fileURLToPath } from "url";

// Initialize Firebase Admin
const credentials = JSON.parse(fs.readFileSync("../hidden.json"));
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../build")));

// Set up routes and middleware
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.use(async (req, res, next) => {
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

// Initialize the Discord Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Required for joining a guild
    GatewayIntentBits.GuildMembers, // If you need to listen for member updates (e.g., join events)
    GatewayIntentBits.GuildMessages, // If you need to listen for messages
    GatewayIntentBits.MessageContent, // For reading message content (new permission as of 2022)
  ],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for a user joining the server
client.on("guildMemberAdd", async (member) => {
  try {
    const userRef = db.collection("users").doc(member.id); // Retrieve user info from Firestore
    const userSnapshot = await userRef.get();

    if (userSnapshot.exists) {
      const userData = userSnapshot.data();
      const displayName = userData.displayName; // Get the stored display name

      // Update the user's nickname in Discord
      await member.setNickname(displayName);
      console.log(`Updated ${member.user.tag}'s nickname to ${displayName}`);
    } else {
      console.log(`User data not found for ${member.user.tag}`);
    }
  } catch (error) {
    console.error("Error updating nickname:", error);
  }
});

// Log in to Discord with your bot's token
const token = process.env.DISCORD_BOT_TOKEN;
client.login(token);

const PORT = process.env.PORT || 8000;

connectToDB(() => {
  console.log("Successfully connected to Database");
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
});
