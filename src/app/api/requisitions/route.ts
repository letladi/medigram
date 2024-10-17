import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongoose";
import { RequisitionModel } from "@/models/Requisition";
import { TestModel } from "@/models/Test";
import { PatientModel } from "@/models/Patient";
import { PhysicianModel } from "@/models/Physician";
import isEmpty from "lodash/isEmpty";

/**
 * Helper to parse form data from a Next.js request.
 */
async function parseFormData(request: NextRequest) {
  const formData = await request.formData();
  const fields: Record<string, string | string[]> = {};

  formData.forEach((value, key) => {
    if (key.startsWith("testNames[") || key.startsWith("samples[")) {
      const arrayKey = key.split("[")[0];
      if (!fields[arrayKey]) {
        fields[arrayKey] = [];
      }
      (fields[arrayKey] as string[]).push(value.toString());
    } else {
      fields[key] = value.toString();
    }
  });

  return fields;
}

/**
 * POST: Create a new requisition with associated tests for a patient and physician.
 */
export async function POST(request: NextRequest) {
  await connectMongoDB();
  try {
    const fields = await parseFormData(request);
    console.log("Received form data:", fields);

    const { patientId, physicianId } = fields;
    const testNames = fields.testNames as string[];
    const samples = fields.samples as string[];

    // Validate required fields
    if (
      !patientId ||
      !physicianId ||
      !Array.isArray(testNames) ||
      isEmpty(testNames) ||
      !Array.isArray(samples) ||
      isEmpty(samples)
    ) {
      return NextResponse.json(
        { error: "Missing required fields or empty arrays" },
        { status: 400 },
      );
    }

    // Validate patient and physician existence
    const patient = await PatientModel.findById(patientId);
    const physician = await PhysicianModel.findById(physicianId);

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    if (!physician) {
      return NextResponse.json(
        { error: "Physician not found" },
        { status: 404 },
      );
    }

    // Create requisition
    const requisition = new RequisitionModel({
      patientId,
      physicianId,
      dateSubmitted: new Date(),
      status: "Pending",
      samples,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedRequisition = await requisition.save();

    // Create tests for the requisition
    const tests = await Promise.all(
      testNames.map(async (testName: string) => {
        const newTest = new TestModel({
          name: testName,
          requisitionId: savedRequisition._id,
          patientId,
        });
        return newTest.save();
      }),
    );

    return NextResponse.json(
      { id: savedRequisition._id.toString() },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating requisition:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
