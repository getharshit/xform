import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }

    // Check if form exists
    const existingForm = await prisma.form.findUnique({
      where: { id }
    });

    if (!existingForm) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Check if form has at least one field
    const fields = existingForm.fields as any[];
    if (!fields || fields.length === 0) {
      return NextResponse.json(
        { error: 'Cannot publish form without fields' },
        { status: 400 }
      );
    }

    // Publish the form
    const updatedForm = await prisma.form.update({
      where: { id },
      data: {
        published: true,
        publishedAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log(`✅ Form ${id} published successfully`);

    return NextResponse.json({
      success: true,
      message: 'Form published successfully',
      published: true,
      publishedAt: updatedForm.publishedAt,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/form/${id}`
    });

  } catch (error) {
    console.error('❌ Error publishing form:', error);
    return NextResponse.json(
      { error: 'Failed to publish form' },
      { status: 500 }
    );
  }
}

// Unpublish endpoint
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const updatedForm = await prisma.form.update({
      where: { id },
      data: {
        published: false,
        publishedAt: null,
        updatedAt: new Date()
      }
    });

    console.log(`📝 Form ${id} unpublished`);

    return NextResponse.json({
      success: true,
      message: 'Form unpublished successfully',
      published: false
    });

  } catch (error) {
    console.error('❌ Error unpublishing form:', error);
    return NextResponse.json(
      { error: 'Failed to unpublish form' },
      { status: 500 }
    );
  }
}