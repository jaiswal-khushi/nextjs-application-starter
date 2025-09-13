import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { buyerUpdateSchema } from '@/lib/validations'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const buyer = await prisma.buyer.findFirst({
      where: {
        id: params.id,
        ownerId: user.id,
      },
    })

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
    }

    const buyerWithParsedTags = {
      ...buyer,
      tags: buyer.tags ? buyer.tags.split(',').filter(tag => tag.trim()) : [],
    }

    return NextResponse.json(buyerWithParsedTags)
  } catch (error) {
    console.error('Error fetching buyer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = buyerUpdateSchema.parse(body)

    // Convert tags array to comma-separated string if provided
    const updateData: any = { ...validatedData }
    if (validatedData.tags) {
      updateData.tags = validatedData.tags.join(',')
    }

    const buyer = await prisma.buyer.updateMany({
      where: {
        id: params.id,
        ownerId: user.id,
      },
      data: updateData,
    })

    if (buyer.count === 0) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
    }

   r
    const updatedBuyer = await prisma.buyer.findUnique({
      where: { id: params.id },
    })

    if (!updatedBuyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
    }

    const buyerWithParsedTags = {
      ...updatedBuyer,
      tags: updatedBuyer.tags ? updatedBuyer.tags.split(',').filter(tag => tag.trim()) : [],
    }

    return NextResponse.json(buyerWithParsedTags)
  } catch (error) {
    console.error('Error updating buyer:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const buyer = await prisma.buyer.deleteMany({
      where: {
        id: params.id,
        ownerId: user.id,
      },
    })

    if (buyer.count === 0) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Buyer deleted successfully' })
  } catch (error) {
    console.error('Error deleting buyer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
