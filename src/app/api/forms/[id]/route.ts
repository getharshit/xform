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

    // Validate fields if they're being updated
    if (updateData.fields && Array.isArray(updateData.fields)) {
      for (const field of updateData.fields) {
        if (!validateFieldType(field)) {
          return NextResponse.json(
            { error: `Invalid field type: ${field.type}` },
            { status: 400 }
          );
        }
        
        // Validate required properties for choice fields
        if ((field.type === 'multipleChoice' || field.type === 'dropdown') && 
            (!field.options || !Array.isArray(field.options) || field.options.length === 0)) {
          return NextResponse.json(
            { error: `Field "${field.label}" must have at least one option` },
            { status: 400 }
          );
        }
        
        // Validate rating fields
        if ((field.type === 'rating' || field.type === 'numberRating') && 
            (!field.maxRating || field.maxRating < 1)) {
          return NextResponse.json(
            { error: `Field "${field.label}" must have a valid maxRating` },
            { status: 400 }
          );
        }
      }
    }

    // Prepare update data - only include provided fields
    const updatePayload: any = {
      updatedAt: new Date()
    };

    // Update basic properties if provided
    if (updateData.title !== undefined) updatePayload.title = updateData.title;
    if (updateData.description !== undefined) updatePayload.description = updateData.description;
    if (updateData.prompt !== undefined) updatePayload.prompt = updateData.prompt;
    if (updateData.fields !== undefined) updatePayload.fields = updateData.fields;
    if (updateData.theme !== undefined) updatePayload.theme = updateData.theme;

    // Update enhanced properties if provided
    if (updateData.customization !== undefined) updatePayload.customization = updateData.customization;
    if (updateData.layout !== undefined) updatePayload.layout = updateData.layout;
    if (updateData.settings !== undefined) updatePayload.settings = updateData.settings;
    if (updateData.fieldGroups !== undefined) updatePayload.fieldGroups = updateData.fieldGroups;

    // Update form in database
    const updatedForm = await prisma.form.update({
      where: { id },
      data: updatePayload
    });

    // Return updated form in same format as GET
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

    return NextResponse.json(responseForm);
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json(
      { error: 'Failed to update form' },
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