import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Patient } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('GET request received for patient:', params.id); // Debugging

  try {
    const client = await clientPromise;
    const db = client.db('medigram');
    const patient = await db.collection<Patient>('patients').findOne({
      _id: new ObjectId(params.id),
    });

    if (!patient) {
      console.warn('Patient not found:', params.id); // Debugging
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    console.log('Patient found:', patient); // Debugging
    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error); // Debugging
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
