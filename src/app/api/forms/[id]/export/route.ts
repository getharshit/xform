import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formId = params.id;
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'csv';
    const dateRange = url.searchParams.get('dateRange') || 'all';

    // Get form with fields
    const form = await prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Calculate date filter
    let dateFilter = {};
    if (dateRange !== 'all') {
      const cutoff = new Date();
      if (dateRange === 'week') {
        cutoff.setDate(cutoff.getDate() - 7);
      } else if (dateRange === 'month') {
        cutoff.setMonth(cutoff.getMonth() - 1);
      }
      dateFilter = { submittedAt: { gte: cutoff } };
    }

    // Get filtered responses
    const responses = await prisma.response.findMany({
      where: { formId, ...dateFilter },
      orderBy: { submittedAt: 'desc' },
    });

    if (format === 'csv') {
      // Generate CSV
      const fields = form.fields as any[];
      const headers = ['Response ID', 'Submitted At', 'IP Address', ...fields.map(f => f.label)];
      
      const csvRows = [
        headers.join(','),
        ...responses.map(response => [
          response.id,
          new Date(response.submittedAt).toISOString(),
          response.ipAddress || '',
          ...fields.map(field => {
            const value = (response.data as any)[field.id] || '';
            // Escape commas and quotes for CSV
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          })
        ].join(','))
      ];

      const csv = csvRows.join('\n');
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${form.title}-responses.csv"`,
        },
      });
    } else {
      // Return JSON
      const jsonData = {
        form: {
          id: form.id,
          title: form.title,
          description: form.description,
          fields: form.fields,
        },
        responses: responses.map(r => ({
          id: r.id,
          submittedAt: r.submittedAt,
          ipAddress: r.ipAddress,
          data: r.data,
        })),
        exportedAt: new Date().toISOString(),
        totalResponses: responses.length,
      };

      return new NextResponse(JSON.stringify(jsonData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${form.title}-responses.json"`,
        },
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}