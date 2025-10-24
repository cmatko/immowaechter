import { NextRequest, NextResponse } from 'next/server';
import { getLinearTeams } from '@/lib/linear-api';

export async function GET(request: NextRequest) {
  try {
    const teams = await getLinearTeams();
    
    return NextResponse.json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error('Error fetching Linear teams:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Linear teams',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


