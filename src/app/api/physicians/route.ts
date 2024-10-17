import { NextRequest, NextResponse } from 'next/server';
import { PhysicianModel } from '@/models/Physician';
import { AddressModel } from '@/models/Address';
import { connectMongoDB } from '@/lib/mongoose';
import { getGridFSBucket } from '@/lib/gridfs';
import { Readable } from 'stream';
import { ObjectId } from 'mongodb';

/**
 * Helper to parse form data from a Next.js request.
 */
async function parseFormData(request: NextRequest) {
  const formData = await request.formData();
  const fields: Record<string, string> = {};
  let avatarBuffer: Buffer | undefined;
  let avatarName: string | undefined;

  formData.forEach((value, key) => {
    if (key === 'avatar' && value instanceof Blob) {
      // We'll handle the Blob conversion to Buffer asynchronously later
      avatarName = (value as any).name || 'avatar';
    } else {
      fields[key] = value.toString();
    }
  });

  // Handle Blob to Buffer conversion asynchronously
  const avatarFile = formData.get('avatar');
  if (avatarFile instanceof Blob) {
    avatarBuffer = Buffer.from(await avatarFile.arrayBuffer());
  }

  return { fields, avatarBuffer, avatarName };
}

/**
 * GET: Retrieve all physicians with their related patients and requisitions.
 */
export async function GET() {
  await connectMongoDB();
  try {
    // Find all physicians and populate their related fields
    const physicians = await PhysicianModel.aggregate([
      {
        $lookup: {
          from: 'requisitions',
          localField: '_id',
          foreignField: 'physicianId',
          as: 'requisitions',
        },
      },
      {
        $lookup: {
          from: 'patients',
          localField: 'requisitions.patientId',
          foreignField: '_id',
          as: 'patients',
        },
      },
    ]);

    return NextResponse.json(physicians);
  } catch (error) {
    console.error('Error fetching physicians:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST: Create a new physician with optional avatar upload.
 */
export async function POST(request: NextRequest) {
  await connectMongoDB();
  const bucket = await getGridFSBucket();

  console.log('fs-bucket', bucket)

  try {
    const formData = await request.formData();
    const fields: Record<string, string> = {};
    let avatarBuffer: Buffer | undefined;
    let avatarName: string | undefined;

    formData.forEach((value, key) => {
      if (key === 'avatar' && value instanceof Blob) {
        avatarName = value.name || 'avatar';
      } else {
        fields[key] = value.toString();
      }
    });

    const avatarFile = formData.get('avatar');
    if (avatarFile instanceof Blob) {
      avatarBuffer = Buffer.from(await avatarFile.arrayBuffer());
    }

    const { name, specialization, street, city, province, postalCode, licenseNumber } = fields;
    let avatarUrl = null;

    // Upload avatar to GridFS if available
    if (avatarBuffer && avatarName) {
      const uploadStream = bucket.openUploadStream(avatarName);
      const bufferStream = Readable.from(avatarBuffer);
      
      await new Promise((resolve, reject) => {
        bufferStream.pipe(uploadStream)
          .on('finish', resolve)
          .on('error', reject);
      });

      avatarUrl = `/api/avatars/${uploadStream.id}`;
    }

    // Create and save the address
    const address = new AddressModel({ street, city, province, postalCode });
    const savedAddress = await address.save();

    // Create new physician object
    const newPhysician = new PhysicianModel({
      name,
      specialization,
      addressId: savedAddress._id,
      licenseNumber,
      avatarUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedPhysician = await newPhysician.save();
    
    return NextResponse.json({ id: savedPhysician._id.toString() }, { status: 201 });
  } catch (error) {
    console.error('Error creating physician:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE: Remove a physician.
 */
export async function DELETE(request: NextRequest) {
  await connectMongoDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Physician ID is required' }, { status: 400 });
  }

  const bucket = await getGridFSBucket();

  try {
    const physician = await PhysicianModel.findById(id);

    if (!physician) {
      return NextResponse.json({ error: 'Physician not found' }, { status: 404 });
    }

    // Delete avatar from GridFS if available
    if (physician.avatarUrl) {
      const avatarId = physician.avatarUrl.split('/').pop();
      await bucket.delete(new ObjectId(avatarId)).catch(console.error);
    }

    // Delete the associated address
    await AddressModel.deleteOne({ _id: physician.addressId });
    await PhysicianModel.deleteOne({ _id: id });
    return NextResponse.json({ message: 'Physician deleted successfully' });
  } catch (error) {
    console.error('Error deleting physician:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}