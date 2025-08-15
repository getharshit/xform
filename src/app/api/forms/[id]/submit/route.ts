import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Helper function to validate field responses based on field type
function validateFieldResponse(field: any, value: any): { isValid: boolean; error?: string } {
  // Skip validation for display-only fields
  if (['statement', 'pageBreak', 'startingPage', 'postSubmission'].includes(field.type)) {
    return { isValid: true };
  }

  // Check required fields
  if (field.required && (value === undefined || value === null || value === '')) {
    return { 
      isValid: false, 
      error: `${field.label} is required` 
    };
  }

  // If field is not required and empty, it's valid
  if (!field.required && (value === undefined || value === null || value === '')) {
    return { isValid: true };
  }

  // Type-specific validation
  switch (field.type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { 
          isValid: false, 
          error: `${field.label} must be a valid email address` 
        };
      }
      break;

    case 'website':
      try {
        const url = value.startsWith('http') ? value : `https://${value}`;
        new URL(url);
      } catch {
        return { 
          isValid: false, 
          error: `${field.label} must be a valid website URL` 
        };
      }
      break;

    case 'phoneNumber':
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        return { 
          isValid: false, 
          error: `${field.label} must be a valid phone number` 
        };
      }
      break;

    case 'numberRating':
    case 'rating':
      const rating = Number(value);
      if (isNaN(rating)) {
        return { 
          isValid: false, 
          error: `${field.label} must be a number` 
        };
      }
      if (field.minRating && rating < field.minRating) {
        return { 
          isValid: false, 
          error: `${field.label} must be at least ${field.minRating}` 
        };
      }
      if (field.maxRating && rating > field.maxRating) {
        return { 
          isValid: false, 
          error: `${field.label} must be no more than ${field.maxRating}` 
        };
      }
      break;

    case 'opinionScale':
      const opinion = Number(value);
      if (isNaN(opinion) || opinion < 1 || opinion > 10) {
        return { 
          isValid: false, 
          error: `${field.label} must be a number between 1 and 10` 
        };
      }
      break;

    case 'yesNo':
      if (!['yes', 'no', true, false, 'true', 'false'].includes(value)) {
        return { 
          isValid: false, 
          error: `${field.label} must be yes or no` 
        };
      }
      break;

    case 'multipleChoice':
      if (field.options && !field.options.includes(value)) {
        return { 
          isValid: false, 
          error: `${field.label} must be one of the provided options` 
        };
      }
      break;

    case 'dropdown':
      if (field.options && !field.options.includes(value)) {
        return { 
          isValid: false, 
          error: `${field.label} must be one of the provided options` 
        };
      }
      break;

    case 'legal':
      if (value !== true && value !== 'true' && value !== 'accepted') {
        return { 
          isValid: false, 
          error: `${field.label} must be accepted` 
        };
      }
      break;

    case 'shortText':
    case 'text':
      if (field.maxLength && value.length > field.maxLength) {
        return { 
          isValid: false, 
          error: `${field.label} must be no more than ${field.maxLength} characters` 
        };
      }
      if (field.minLength && value.length < field.minLength) {
        return { 
          isValid: false, 
          error: `${field.label} must be at least ${field.minLength} characters` 
        };
      }
      break;

    case 'longText':
      if (field.maxLength && value.length > field.maxLength) {
        return { 
          isValid: false, 
          error: `${field.label} must be no more than ${field.maxLength} characters` 
        };
      }
      if (field.minLength && value.length < field.minLength) {
        return { 
          isValid: false, 
          error: `${field.label} must be at least ${field.minLength} characters` 
        };
      }
      break;

    case 'fileUpload':
      // Note: File upload validation would typically happen on the client side
      // Here we just check if a file reference was provided
      if (!value || !value.filename) {
        return { 
          isValid: false, 
          error: `${field.label} requires a file to be uploaded` 
        };
      }
      break;

    case 'date':
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value)) {
        return { 
          isValid: false, 
          error: `${field.label} must be a valid date (YYYY-MM-DD)` 
        };
      }
      break;
  }

  // Custom validation rules
  if (field.validationRules?.pattern) {
    const customRegex = new RegExp(field.validationRules.pattern);
    if (!customRegex.test(value)) {
      const message = field.validationRules.customMessage || 
                     `${field.label} format is invalid`;
      return { isValid: false, error: message };
    }
  }

  return { isValid: true };
}

// ============================================================================
// POST /api/forms/[id]/submit - Submit form response
// ============================================================================
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Response data is required' },
        { status: 400 }
      );
    }

    // Fetch form to validate against
    const form = await prisma.form.findUnique({
      where: { id }
    });

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    const formFields = form.fields as any[];
    const validationErrors: string[] = [];
    const cleanedData: Record<string, any> = {};

    // Validate each field response
    for (const field of formFields) {
      // Skip validation for display-only fields
      if (['statement', 'pageBreak', 'startingPage', 'postSubmission'].includes(field.type)) {
        continue;
      }

      const value = data[field.id];
      const validation = validateFieldResponse(field, value);

      if (!validation.isValid) {
        validationErrors.push(validation.error!);
      } else if (value !== undefined && value !== null && value !== '') {
        // Only store non-empty values
        cleanedData[field.id] = value;
      }
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    // Check form settings for multiple submissions
    const formSettings = form.settings as any;
    if (formSettings?.allowMultipleSubmissions === false) {
      // Check if this IP already submitted (basic duplicate prevention)
      const clientIP = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
      
      const existingResponse = await prisma.response.findFirst({
        where: {
          formId: id,
          ipAddress: clientIP
        }
      });

      if (existingResponse) {
        return NextResponse.json(
          { error: 'You have already submitted a response to this form' },
          { status: 409 }
        );
      }
    }

    // Collect additional metadata
    const clientIP = formSettings?.collectIPAddress !== false ? 
      (request.headers.get('x-forwarded-for') || 
       request.headers.get('x-real-ip') || 
       null) : null;

    const userAgent = formSettings?.collectUserAgent !== false ?
      request.headers.get('user-agent') : null;

    // Create response record
    const response = await prisma.response.create({
      data: {
        formId: id,
        data: cleanedData,
        ipAddress: clientIP,
        userAgent: userAgent
      }
    });

    // Return success response
    return NextResponse.json({
      success: true,
      responseId: response.id,
      submittedAt: response.submittedAt,
      message: 'Form submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}