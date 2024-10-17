import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Physician } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("medigram");
    
    const physicianAggregation = await db.collection<Physician>("physicians").aggregate([
      {
        $match: {
          _id: new ObjectId(params.id)
        }
      },
      {
        $lookup: {
          from: "addresses",
          localField: "addressId",
          foreignField: "_id",
          as: "address"
        }
      },
      {
        $unwind: {
          path: "$address",
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    const physician = physicianAggregation[0];

    if (!physician) {
      return NextResponse.json({ error: 'Physician not found' }, { status: 404 });
    }

    return NextResponse.json(physician);
  } catch (error) {
    console.error('Error fetching physician:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("medigram");
    const updates = await request.json();

    const result = await db.collection<Physician>("physicians").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Physician not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Physician updated successfully' });
  } catch (error) {
    console.error('Error updating physician:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("medigram");

    const result = await db.collection<Physician>("physicians").deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Physician not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Physician deleted successfully' });
  } catch (error) {
    console.error('Error deleting physician:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}