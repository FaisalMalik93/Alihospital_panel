import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { generatedAt: 'desc' },
      include: {
        patient: true,
        template: {
          include: {
            doctor: true,
          },
        },
      },
    })
    return NextResponse.json(reports)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, templateId, content } = body

    if (!patientId || !templateId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const report = await prisma.report.create({
      data: {
        patientId,
        templateId,
        content,
      },
      include: {
        patient: true,
        template: {
          include: {
            doctor: true,
          },
        },
      },
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
}
