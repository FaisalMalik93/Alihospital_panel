import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reportTemplates: true,
      },
    })
    return NextResponse.json(doctors)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, specialization, phone, email, qualifications } = body

    if (!name || !specialization || !phone || !email || !qualifications) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialization,
        phone,
        email,
        qualifications,
      },
    })

    return NextResponse.json(doctor, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create doctor' },
      { status: 500 }
    )
  }
}
