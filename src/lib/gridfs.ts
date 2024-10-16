import { GridFSBucket, MongoClient } from 'mongodb';
import clientPromise from './mongodb';

let bucket: GridFSBucket | null = null;

export async function getGridFSBucket() {
  if (bucket) return bucket;

  const client: MongoClient = await clientPromise;
  const db = client.db('medigram');
  bucket = new GridFSBucket(db, { bucketName: 'avatars' });

  return bucket;
}
