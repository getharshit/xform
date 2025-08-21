// src/app/api/qr/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

interface QRGenerateRequest {
  url: string;
  size?: number;
  format?: 'png' | 'svg';
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: QRGenerateRequest = await request.json();
    
    const {
      url,
      size = 200,
      format = 'png',
      errorCorrectionLevel = 'M',
      margin = 4,
      color = { dark: '#000000', light: '#FFFFFF' }
    } = body;

    // Validate required fields
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Validate size
    if (size < 50 || size > 1000) {
      return NextResponse.json(
        { error: 'Size must be between 50 and 1000 pixels' },
        { status: 400 }
      );
    }

    // QR Code options
    const options = {
      errorCorrectionLevel,
      type: 'image/png' as const,
      quality: 0.92,
      margin,
      color,
      width: size,
    };

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(url, options);

    // Return response
    return NextResponse.json({
      qrCodeDataUrl,
      size,
      format,
      url,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('QR code generation error:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

// Optional: GET method for simple QR generation via query params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const url = searchParams.get('url');
    const size = parseInt(searchParams.get('size') || '200');
    const format = searchParams.get('format') as 'png' | 'svg' || 'png';
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Use the same logic as POST
    const options = {
      errorCorrectionLevel: 'M' as const,
      type: 'image/png' as const,
      quality: 0.92,
      margin: 4,
      color: { dark: '#000000', light: '#FFFFFF' },
      width: size,
    };

    const qrCodeDataUrl = await QRCode.toDataURL(url, options);

    return NextResponse.json({
      qrCodeDataUrl,
      size,
      format,
      url,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('QR code generation error:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}