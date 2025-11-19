import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.reportTemplate.findUnique({
      where: { id: params.id },
      include: {
        doctor: true,
      },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(template)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch template' },
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
    const { name, contentTemplate, doctorId } = body

    const template = await prisma.reportTemplate.update({
      where: { id: params.id },
      data: {
        name,
        contentTemplate,
        doctorId: doctorId || null,
      },
      include: {
        doctor: true,
      },
    })

    return NextResponse.json(template)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.reportTemplate.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
