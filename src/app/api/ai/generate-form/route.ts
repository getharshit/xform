import { NextRequest, NextResponse } from 'next/server';
import { generateFormFromPrompt } from '@/lib/ai/form-generator';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const form = await generateFormFromPrompt(prompt);

    return NextResponse.json(form);
  } catch (error) {
    console.error('Form generation error:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate form' },
      { status: 500 }
    );
  }
}