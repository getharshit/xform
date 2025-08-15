import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; responseId: string } }
) {
  try {
    await prisma.response.delete({
      where: { 
        id: params.responseId,
        formId: params.id // Ensure response belongs to this form
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Response delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete response' },
      { status: 500 }
    );
  }
}