import { NextRequest, NextResponse } from 'next/server';
import { getLinearIssues, createLinearIssue } from '@/lib/linear-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    
    if (!teamId) {
      return NextResponse.json(
        { success: false, error: 'teamId parameter is required' },
        { status: 400 }
      );
    }
    
    const issues = await getLinearIssues(teamId);
    
    return NextResponse.json({
      success: true,
      data: issues,
    });
  } catch (error) {
    console.error('Error fetching Linear issues:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Linear issues',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, teamId, priority } = body;
    
    if (!title || !teamId) {
      return NextResponse.json(
        { success: false, error: 'title and teamId are required' },
        { status: 400 }
      );
    }
    
    const result = await createLinearIssue({
      title,
      description,
      teamId,
      priority,
    });
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error creating Linear issue:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create Linear issue',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


