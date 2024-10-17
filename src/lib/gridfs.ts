import { GridFSBucket, MongoClient } from "mongodb";
import clientPromise from "./mongodb";

let bucket: GridFSBucket | null = null;

export async function getGridFSBucket() {
  if (bucket) {
    console.log("Returning existing GridFS bucket");
    return bucket;
  }

  try {
    console.log("Initializing new GridFS bucket");
    const client: MongoClient = await clientPromise;
    const dbName = process.env.MONGODB_DB_NAME || "medigram";
    const db = client.db(dbName);
    bucket = new GridFSBucket(db, { bucketName: "avatars" });
    console.log("GridFS bucket initialized successfully");
    return bucket;
  } catch (error) {
    console.error("Error initializing GridFS bucket:", error);
    throw error;
  }
}
