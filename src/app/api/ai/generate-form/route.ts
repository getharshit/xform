// src/app/api/ai/generate-form/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateFormFromPrompt } from '@/lib/ai/form-generator';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { generateUniqueFormId } from '@/lib/id-generator';

export async function POST(request: NextRequest) {
  try {
    console.log('AI form generation request received');
    
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Invalid JSON in request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { prompt } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (prompt.trim().length > 500) {
      return NextResponse.json(
        { error: 'Prompt must be 500 characters or less' },
        { status: 400 }
      );
    }

    console.log('Generating form for prompt:', prompt.trim());

    // Generate form using AI
    const generatedForm = await generateFormFromPrompt(prompt.trim());
    
    console.log('Form generated successfully:', {
      title: generatedForm.title,
      fieldCount: generatedForm.fields.length
    });

    // Create form in database
    const formData: Prisma.FormCreateInput = {
       id: await generateUniqueFormId(),
      title: generatedForm.title,
      description: generatedForm.description,
      prompt: prompt.trim(), // Store the original prompt
      fields: generatedForm.fields as unknown as Prisma.JsonArray,
      theme: {
        primaryColor: '#3B82F6',
        fontFamily: 'Inter',
        backgroundColor: '#FFFFFF',
        textColor: '#111827',
        borderRadius: 8,
        spacing: 16
      } as Prisma.JsonObject,
      customization: {} as Prisma.JsonObject,
      layout: {
        type: 'singleColumn',
        options: {
          maxWidth: 600,
          showQuestionNumbers: true
        }
      } as Prisma.JsonObject,
      settings: {
        allowMultipleSubmissions: false,
        showProgressBar: true,
        collectIPAddress: true,
        collectUserAgent: true,
        submitButtonText: 'Submit'
      } as Prisma.JsonObject
    };

    console.log('Saving form to database...');

    const savedForm = await prisma.form.create({
      data: formData
    });

    console.log('Form saved successfully with ID:', savedForm.id);

    // Return the created form
    return NextResponse.json({
      id: savedForm.id,
      title: savedForm.title,
      description: savedForm.description,
      prompt: savedForm.prompt,
      fields: savedForm.fields,
      theme: savedForm.theme,
      customization: savedForm.customization,
      layout: savedForm.layout,
      settings: savedForm.settings,
      createdAt: savedForm.createdAt.toISOString(),
      updatedAt: savedForm.updatedAt.toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error('Error in AI form generation:', error);
    
    // Determine the type of error and respond appropriately
    if (error instanceof Error) {
      // Check if it's a database error
      if (error.message.includes('Prisma') || error.message.includes('database')) {
        return NextResponse.json(
          { 
            error: 'Database error occurred while creating the form',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
          },
          { status: 500 }
        );
      }
      
      // Check if it's an AI generation error
      if (error.message.includes('Ollama') || error.message.includes('AI')) {
        return NextResponse.json(
          { 
            error: 'AI service is currently unavailable. A fallback form was generated.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
          },
          { status: 503 }
        );
      }
      
      // Generic error
      return NextResponse.json(
        { 
          error: 'Failed to generate form',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }
    
    // Unknown error type
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate forms.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate forms.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate forms.' },
    { status: 405 }
  );
}