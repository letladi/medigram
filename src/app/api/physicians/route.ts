import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getGridFSBucket } from '@/lib/gridfs';
import { Patient, Requisition, Test } from '@/types';
import { ObjectId } from 'mongodb';
import formidable from 'formidable';
import { Readable } from 'stream';

// Disable automatic body parsing to handle file uploads with Formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

/** 
 * GET: Retrieve all patients with their tests and requisitions
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('medigram');

    // Fetch all patients
    const patients = await db.collection<Patient>('patients').find({}).toArray();

    // Map patients to include their requisitions and tests
    const patientsWithDetails = await Promise.all(
      patients.map(async (patient) => {
        const requisitions = await db
          .collection<Requisition>('requisitions')
          .find({ patientId: patient._id })
          .toArray();

        // Fetch associated tests for each requisition
        const requisitionsWithTests = await Promise.all(
          requisitions.map(async (req) => {
            const tests = await db
              .collection<Test>('tests')
              .find({ _id: { $in: req.tests.map((t) => t.testId) } })
              .toArray();
            return { ...req, tests };
          })
        );

        return { ...patient, requisitions: requisitionsWithTests };
      })
    );

    return NextResponse.json(patientsWithDetails);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** 
 * POST: Create a new patient with optional avatar upload 
 */
export async function POST(request: NextRequest) {
  const client = await clientPromise;
  const db = client.db('medigram');
  const bucket = await getGridFSBucket();

  try {
    const form = new formidable.IncomingForm();

    // Parse form data and files
    const data: any = await new Promise((resolve, reject) => {
      form.parse(request as any, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const { name, street, city, province, postalCode } = data.fields;
    const avatar = data.files?.avatar;
    let avatarUrl = null;

    // Upload avatar to GridFS if available
    if (avatar) {
      const uploadStream = bucket.openUploadStream(avatar.originalFilename);
      const fileStream = Readable.from(avatar.filepath);
      fileStream.pipe(uploadStream);

      avatarUrl = `/api/avatars/${uploadStream.id}`;
    }

    // Create new patient object
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

    // Delete the avatar from GridFS if available
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
