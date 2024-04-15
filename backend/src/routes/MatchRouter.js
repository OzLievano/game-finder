import express from "express";

const matchRouter = express.Router();

matchRouter.get("/matchList", (req, res) => {
  res.send(
    "This is a list of all open matches where a player is looking for an opponent"
  );
});

matchRouter.post("/match", (req, res) => {
  res.send("this is an api to create a new match");
});

matchRouter.put("/match/:id", (req, res) => {
  res.send("this is an api to update the created match");
});

export default matchRouter;
