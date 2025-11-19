import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const payments = await prisma.doctorPayment.findMany({
      orderBy: { date: 'desc' },
      include: {
        doctor: true,
      },
    })
    return NextResponse.json(payments)
  } catch (error: any) {
    console.error('Error fetching doctor payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { doctorId, amount, notes } = body

    if (!doctorId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const payment = await prisma.doctorPayment.create({
      data: {
        doctorId,
        amount: parseFloat(amount),
        notes: notes || '',
      },
      include: {
        doctor: true,
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error: any) {
    console.error('Error creating doctor payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
