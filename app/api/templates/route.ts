import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const templates = await prisma.reportTemplate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        doctor: true,
      },
    })
    return NextResponse.json(templates)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, contentTemplate, doctorId } = body

    if (!name || !contentTemplate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const template = await prisma.reportTemplate.create({
      data: {
        name,
        contentTemplate,
        doctorId: doctorId || null,
      },
      include: {
        doctor: true,
      },
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
