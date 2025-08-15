import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formId = params.id;

    // Get all responses for analytics
    const responses = await prisma.response.findMany({
      where: { formId },
    });

    // Calculate analytics
    const totalResponses = responses.length;
    
    // Get responses from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const responsesToday = responses.filter(r => 
      new Date(r.submittedAt) >= today
    ).length;

    // Get responses from yesterday for trend
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const responsesYesterday = responses.filter(r => {
      const responseDate = new Date(r.submittedAt);
      return responseDate >= yesterday && responseDate < today;
    }).length;

    // Calculate trend
    let responsesTrend: 'up' | 'down' | 'stable' = 'stable';
    if (responsesToday > responsesYesterday) {
      responsesTrend = 'up';
    } else if (responsesToday < responsesYesterday) {
      responsesTrend = 'down';
    }

    // Mock completion rate and average time for now
    // In a real app, you'd track form views vs completions
    const completionRate = totalResponses > 0 ? 85 : 0; // Mock 85%
    const averageTimeToComplete = 3.5; // Mock 3.5 minutes

    const analytics = {
      totalResponses,
      completionRate,
      averageTimeToComplete,
      responsesToday,
      responsesTrend,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}