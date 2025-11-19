import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      orderBy: { date: 'desc' },
      include: {
        patient: true,
      },
    })
    return NextResponse.json(bills)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bills' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, services, amount, status } = body

    if (!patientId || !services || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const bill = await prisma.bill.create({
      data: {
        patientId,
        services,
        amount: parseFloat(amount),
        status: status || 'unpaid',
      },
      include: {
        patient: true,
      },
    })

    return NextResponse.json(bill, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create bill' },
      { status: 500 }
    )
  }
}
