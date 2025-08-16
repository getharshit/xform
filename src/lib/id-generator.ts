// src/lib/id-generator.ts

/**
 * Generates a 6-character alphanumeric ID
 * Format: [A-Z0-9]{6} (e.g., A3B9K2, X7M4N1)
 */
export function generateShortId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Generates a unique form ID
 * Ensures the ID doesn't already exist in the database
 */
export async function generateUniqueFormId(): Promise<string> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  
  let attempts = 0;
  const maxAttempts = 10; // Prevent infinite loops
  
  while (attempts < maxAttempts) {
    const id = generateShortId();
    
    // Check if ID already exists
    const existingForm = await prisma.form.findUnique({
      where: { id },
      select: { id: true }
    });
    
    if (!existingForm) {
      await prisma.$disconnect();
      return id;
    }
    
    attempts++;
  }
  
  await prisma.$disconnect();
  throw new Error('Failed to generate unique form ID after maximum attempts');
}

/**
 * Generates a unique response ID
 * Ensures the ID doesn't already exist in the database
 */
export async function generateUniqueResponseId(): Promise<string> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  
  let attempts = 0;
  const maxAttempts = 10; // Prevent infinite loops
  
  while (attempts < maxAttempts) {
    const id = generateShortId();
    
    // Check if ID already exists
    const existingResponse = await prisma.response.findUnique({
      where: { id },
      select: { id: true }
    });
    
    if (!existingResponse) {
      await prisma.$disconnect();
      return id;
    }
    
    attempts++;
  }
  
  await prisma.$disconnect();
  throw new Error('Failed to generate unique response ID after maximum attempts');
}

/**
 * Alternative: Generate ID with timestamp prefix for better uniqueness
 * Format: [timestamp][random] (e.g., T4A3B9 where T4 is timestamp-based)
 */
export function generateTimestampId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  const timestamp = Date.now().toString(36).slice(-2).toUpperCase(); // Last 2 chars of timestamp
  
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return timestamp + random; // 6 characters total
}