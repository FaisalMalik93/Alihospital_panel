const fs = require('fs');
const path = require('path');

// Update patients API route
const patientsRouteContent = `import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function generatePatientId() {
  const count = await prisma.patient.count()
  const nextNumber = count + 1
  return \`PAT-\${String(nextNumber).padStart(5, '0')}\`
}

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reports: {
          include: {
            template: true,
          },
        },
        bills: true,
      },
    })
    return NextResponse.json(patients)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, age, gender, contact, address, medicalHistory, mrId } = body

    if (!name || !age || !gender || !contact || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const patientId = await generatePatientId()

    const patient = await prisma.patient.create({
      data: {
        patientId,
        mrId: mrId || null,
        name,
        age: parseInt(age),
        gender,
        contact,
        address,
        medicalHistory: medicalHistory || '',
      },
    })

    return NextResponse.json(patient, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    )
  }
}
`;

fs.writeFileSync('app/api/patients/route.ts', patientsRouteContent);
console.log('✓ Updated patients API route');
