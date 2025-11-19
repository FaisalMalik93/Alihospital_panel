const fs = require('fs');

// 1. Update patients [id] route
const patientsIdRoute = `import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        reports: {
          include: {
            template: true,
          },
        },
        bills: true,
      },
    })

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(patient)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, age, gender, contact, address, medicalHistory, mrId } = body

    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        name,
        age: parseInt(age),
        gender,
        contact,
        address,
        medicalHistory,
        mrId: mrId || null,
      },
    })

    return NextResponse.json(patient)
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.patient.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Patient deleted successfully' })
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    )
  }
}
`;

fs.writeFileSync('app/api/patients/[id]/route.ts', patientsIdRoute);
console.log('✓ Updated patients [id] API route');

console.log('\n✅ All files updated successfully!');
