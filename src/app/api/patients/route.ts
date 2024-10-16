import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getGridFSBucket } from '@/lib/gridfs';
import { Readable } from 'stream';
import { ObjectId } from 'mongodb';
import { Patient } from '@/types';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Helper to parse form data from Next.js request.
 */
async function parseFormData(request: NextRequest) {
  const formData = await request.formData();
  const fields: Record<string, string> = {};
  let avatar: File | undefined;

  formData.forEach((value, key) => {
    if (key === 'avatar' && value instanceof File) {
      avatar = value;
    } else {
      fields[key] = value.toString();
    }
  });

  return { fields, avatar };
}

/**
 * POST: Create a new patient with optional avatar upload.
 */
export async function POST(request: NextRequest) {
  const client = await clientPromise;
  const db = client.db('medigram');
  const bucket = await getGridFSBucket();

  try {
    const { fields, avatar } = await parseFormData(request);

    const { name, street, city, province, postalCode } = fields;
    let avatarUrl = null;

    // Upload avatar to the "avatars" bucket in GridFS
    if (avatar) {
      const arrayBuffer = await avatar.arrayBuffer();
      const uploadStream = bucket.openUploadStream(avatar.name);
      const bufferStream = Readable.from(Buffer.from(arrayBuffer));
      bufferStream.pipe(uploadStream);

      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
      });

      avatarUrl = `/api/avatars/${uploadStream.id}`; // Use the GridFS file ID
    }

    // Create a new patient with the avatar URL
    const newPatient: Patient = {
      name,
      address: { street, city, province, postalCode },
      avatarUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Patient>('patients').insertOne(newPatient);
    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


/** 
 * GET: Retrieve all patients
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('medigram');
    const patients = await db.collection<Patient>('patients').find({}).toArray();
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


/** 
 * DELETE: Remove a patient and delete their avatar from GridFS
 */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('medigram');
  const bucket = await getGridFSBucket();

  try {
    // Find the patient by ID
    const patient = await db.collection<Patient>('patients').findOne({ _id: new ObjectId(id) });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Delete the avatar from GridFS if it exists
    if (patient.avatarUrl) {
      const avatarId = patient.avatarUrl.split('/').pop();
      await bucket.delete(new ObjectId(avatarId)).catch(console.error);
    }

    // Delete the patient from the database
    await db.collection<Patient>('patients').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
