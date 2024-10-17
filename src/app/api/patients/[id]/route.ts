import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongoose";
import { ObjectId } from "mongodb";
import { PatientModel } from "@/models/Patient"; // Ensure this import is correct

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  console.log("GET request received for patient:", params.id);

  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
  }

  await connectMongoDB();

  try {
    const patient = await PatientModel.aggregate([
      {
        $match: { _id: new ObjectId(params.id) },
      },
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
          from: "physicians",
          localField: "requisitions.physicianId",
          foreignField: "_id",
          as: "physicianDetails",
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
      {
        $addFields: {
          requisitions: {
            $map: {
              input: "$requisitions",
              as: "requisition",
              in: {
                $mergeObjects: [
                  "$$requisition",
                  {
                    physician: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$physicianDetails",
                            as: "physician",
                            cond: {
                              $eq: [
                                "$$physician._id",
                                "$$requisition.physicianId",
                              ],
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          physicianDetails: 0, // Remove the intermediate lookup array for physicians
        },
      },
    ]).exec();

    if (!patient || patient.length === 0) {
      console.warn("Patient not found:", params.id);
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    console.log("Patient found:", patient[0]);
    return NextResponse.json(patient[0]);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
