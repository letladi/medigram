import { NextRequest, NextResponse } from "next/server";
import { getGridFSBucket } from "@/lib/gridfs";
import { Readable } from "stream";
import { ObjectId } from "mongodb";
import { PatientModel } from "@/models/Patient";
import { AddressModel } from "@/models/Address";
import { connectMongoDB } from "@/lib/mongoose";

/**
 * Helper to parse form data from a Next.js request.
 */
async function parseFormData(request: NextRequest) {
  const formData = await request.formData();
  const fields: Record<string, string> = {};
  let avatarBlob: Blob | undefined;
  let avatarName: string | undefined;

  formData.forEach((value, key) => {
    if (key === "avatar" && value instanceof Blob) {
      avatarBlob = value;
      avatarName = (value as any).name || "avatar";
    } else {
      fields[key] = value.toString();
    }
  });

  return { fields, avatarBlob, avatarName };
}

/**
 * POST: Create a new patient with optional avatar upload.
 */
export async function POST(request: NextRequest) {
  await connectMongoDB();
  try {
    const bucket = await getGridFSBucket();
    const { fields, avatarBlob, avatarName } = await parseFormData(request);

    const { name, street, city, province, postalCode } = fields;
    let avatarUrl = null;

    // Upload avatar to GridFS if present
    if (avatarBlob && avatarName) {
      const arrayBuffer = await avatarBlob.arrayBuffer();
      const uploadStream = bucket.openUploadStream(avatarName);
      const bufferStream = Readable.from(Buffer.from(arrayBuffer));

      await new Promise((resolve, reject) => {
        bufferStream
          .pipe(uploadStream)
          .on("finish", resolve)
          .on("error", reject);
      });

      avatarUrl = `/api/avatars/${uploadStream.id}`;
    }

    // Create and save the address
    const address = new AddressModel({ street, city, province, postalCode });
    const savedAddress = await address.save();

    // Create and save the patient with the address ID
    const newPatient = new PatientModel({
      name,
      addressId: savedAddress._id, // Reference the address ID
      avatarUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedPatient = await newPatient.save();
    return NextResponse.json(
      { id: savedPatient._id.toString() },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * GET: Retrieve all patients from the database.
 */
export async function GET() {
  await connectMongoDB();

  try {
    const patients = await PatientModel.aggregate([
      {
        $lookup: {
          from: "requisitions",
          localField: "_id",
          foreignField: "patientId",
          as: "requisitions",
        },
      },
      {
        $lookup: {
          from: "tests",
          localField: "requisitions._id",
          foreignField: "requisitionId",
          as: "tests",
        },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "addressId",
          foreignField: "_id",
          as: "address",
        },
      },
      {
        $unwind: {
          path: "$address",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE: Remove a patient and delete their avatar from GridFS.
 */
export async function DELETE(request: NextRequest) {
  await connectMongoDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Patient ID is required" },
      { status: 400 },
    );
  }

  try {
    const bucket = await getGridFSBucket();
    const patient = await PatientModel.findById(id);

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Delete avatar from GridFS if it exists
    if (patient.avatarUrl) {
      const avatarId = patient.avatarUrl.split("/").pop();
      await bucket.delete(new ObjectId(avatarId)).catch(console.error);
    }

    // Delete the patient and associated address
    await AddressModel.deleteOne({ _id: patient.addressId });
    await PatientModel.deleteOne({ _id: id });

    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
