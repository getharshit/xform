import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Helper function to validate field types (same as in main route)
function validateFieldType(field: any): boolean {
  const validTypes = [
    // Legacy types (existing)
    'text', 'multipleChoice', 'dropdown', 'rating', 'date',
    // New types (enhanced)
    'shortText', 'longText', 'email', 'website', 'phoneNumber', 
    'numberRating', 'yesNo', 'opinionScale', 'statement', 'legal', 
    'fileUpload', 'pageBreak', 'startingPage', 'postSubmission'
  ];
  
  return validTypes.includes(field.type);
}

// ============================================================================
// GET /api/forms/[id] - Get single form by ID
// ============================================================================
export async function GET(
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

    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        responses: {
          select: {
            id: true,
            submittedAt: true
          }
        }
      }
    });

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Return form with enhanced structure but maintain compatibility
    const responseForm = {
      id: form.id,
      title: form.title,
      description: form.description,
      prompt: form.prompt,
      fields: form.fields,
      theme: form.theme,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
 published: 'published' in form ? (form as any).published : false,
  publishedAt: 'publishedAt' in form ? (form as any).publishedAt : null, 
      // Enhanced properties (will be ignored by current builder)
      customization: form.customization,
      layout: form.layout,
      settings: form.settings,
      fieldGroups: form.fieldGroups,
      // Response metadata
      responseCount: form.responses.length
    };

    return NextResponse.json(responseForm);
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT /api/forms/[id] - Update form
// ============================================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const updateData = await request.json();

    // Your existing debug code (keep it)
    console.log("📡 API PUT request received for form:", id);
    console.log("🎨 Customization in request:", updateData.customization);

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

    // Prepare update data
    const updatePayload: any = {
      updatedAt: new Date()
    };

    // Update properties if provided
    if (updateData.title !== undefined) updatePayload.title = updateData.title;
    if (updateData.description !== undefined) updatePayload.description = updateData.description;
    if (updateData.prompt !== undefined) updatePayload.prompt = updateData.prompt;
    if (updateData.fields !== undefined) updatePayload.fields = updateData.fields;
    if (updateData.theme !== undefined) updatePayload.theme = updateData.theme;
    if (updateData.customization !== undefined) {
      updatePayload.customization = updateData.customization;
      console.log("✅ Adding customization to update payload:", updateData.customization);
    }
    if (updateData.layout !== undefined) updatePayload.layout = updateData.layout;
    if (updateData.settings !== undefined) updatePayload.settings = updateData.settings;
    if (updateData.fieldGroups !== undefined) updatePayload.fieldGroups = updateData.fieldGroups;

    console.log("💾 Final update payload:", updatePayload);

    // Update form in database
    const updatedForm = await prisma.form.update({
      where: { id },
      data: updatePayload
    });

    console.log("✅ Database update successful");
    console.log("🎨 Saved customization:", updatedForm.customization);

    // ✅ FIX: Make sure to ALWAYS return a response
    const responseForm = {
      id: updatedForm.id,
      title: updatedForm.title,
      description: updatedForm.description,
      prompt: updatedForm.prompt,
      fields: updatedForm.fields,
      theme: updatedForm.theme,
      createdAt: updatedForm.createdAt,
      updatedAt: updatedForm.updatedAt,
      customization: updatedForm.customization,
      layout: updatedForm.layout,
      settings: updatedForm.settings,
      fieldGroups: updatedForm.fieldGroups
    };

    console.log("📤 Returning response form:", responseForm);
    
    // ✅ CRITICAL: Return the response
    return NextResponse.json(responseForm);
    
  } catch (error) {
    console.error('❌ API Error updating form:', error);
    
    // ✅ CRITICAL: Always return an error response
    return NextResponse.json(
      { 
        error: 'Failed to update form',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/forms/[id] - Delete form and all responses
// ============================================================================
export async function DELETE(
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
      where: { id },
      include: {
        _count: {
          select: {
            responses: true
          }
        }
      }
    });

    if (!existingForm) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Delete form (responses will be deleted automatically due to CASCADE)
    await prisma.form.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Form deleted successfully',
      deletedFormId: id,
      deletedResponsesCount: existingForm._count.responses
    });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json(
      { error: 'Failed to delete form' },
      { status: 500 }
    );
  }
}