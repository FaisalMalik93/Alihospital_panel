import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bill = await prisma.bill.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
      },
    })

    if (!bill) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(bill)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch bill' },
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
    const { services, amount, status } = body

    const bill = await prisma.bill.update({
      where: { id: params.id },
      data: {
        services,
        amount: parseFloat(amount),
        status,
      },
      include: {
        patient: true,
      },
    })

    return NextResponse.json(bill)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update bill' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.bill.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Bill deleted successfully' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete bill' },
      { status: 500 }
    )
  }
}
