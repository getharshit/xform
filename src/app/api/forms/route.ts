import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateUniqueFormId } from '@/lib/id-generator';

// Helper function to validate new field types
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

export async function GET(request: NextRequest) {
  try {
    // Fetch all forms with response counts (unchanged for builder compatibility)
    const forms = await prisma.form.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            responses: true
          }
        }
      }
    });

    // Transform the data to include responseCount at the top level
    // (Keep exact same format for builder compatibility)
    const formsWithResponseCount = forms.map(form => ({
      id: form.id,
      title: form.title,
      description: form.description,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      responseCount: form._count.responses,
      theme: form.theme
    }));

    return NextResponse.json(formsWithResponseCount);
  } catch (error) {
    console.error('Forms fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const formId = await generateUniqueFormId();
  
  try {
    const { 
      title, 
      description, 
      fields, 
      theme, 
      prompt,
      // New optional properties
      customization,
      layout,
      settings,
      fieldGroups
    } = await request.json();

    // Keep existing validation
    if (!title || !fields || !Array.isArray(fields)) {
      return NextResponse.json(
        { error: 'Title and fields are required' },
        { status: 400 }
      );
    }

    // Validate field types (both legacy and new)
    for (const field of fields) {
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

    // Create form with enhanced database structure
    const form = await prisma.form.create({


      data: {
        id: formId,
        title,
        description: description || '',
        fields,
        theme: theme || {},
        prompt: prompt || '',
        // New columns with safe defaults
        customization: customization || {},
        layout: layout || {
          type: 'singleColumn',
          options: {
            maxWidth: 600,
            padding: 24
          }
        },
        settings: settings || {
          allowMultipleSubmissions: false,
          showProgressBar: true,
          collectIPAddress: true
        },
        fieldGroups: fieldGroups || null
      },
    });

    // Return in same format builder expects
    return NextResponse.json(form);
  } catch (error) {
    console.error('Form save error:', error);
    
    return NextResponse.json(
      { error: 'Failed to save form' },
      { status: 500 }
    );
  }
}