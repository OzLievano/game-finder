import { MongoClient } from "mongodb";
import "dotenv/config";

let db;

async function connectToDB(cb) {
  const client = new MongoClient(
    `mongodb+srv://osvaldoalievano:fyn9cCkKqSHgFe3s@cluster0.8dgou2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  );

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    db = client.db("game-finder-db");

    // Return the database object
    cb();
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    throw error; // Re-throw the error to be handled where connectToDB is called
  }
}

export { db, connectToDB };
