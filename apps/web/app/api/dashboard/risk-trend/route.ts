import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId') || 'all';
    const timeframe = searchParams.get('timeframe') || '30d';
    
    // Mock trend data based on our 10 Risk Alerts
    const now = new Date();
    const daysBack = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    // Generate realistic trend data showing increasing risk over time
    const trendData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Simulate increasing risk over time (more alerts as time progresses)
      const baseCritical = 3;
      const baseLegal = 0;
      const timeFactor = Math.min(daysSinceStart / daysBack, 1); // 0 to 1 over the period
      
      const critical = Math.round(baseCritical + (timeFactor * 2)); // 3 to 5 critical
      const legal = Math.round(baseLegal + (timeFactor * 1)); // 0 to 1 legal
      
      trendData.push({
        date: dateStr,
        critical,
        legal,
        total: critical + legal
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Aggregate data by week for longer timeframes
    let aggregatedData = trendData;
    if (timeframe === '90d' || timeframe === '1y') {
      const weeklyData = [];
      for (let i = 0; i < trendData.length; i += 7) {
        const weekData = trendData.slice(i, i + 7);
        const weekStart = weekData[0]?.date;
        
        if (weekData.length > 0) {
          weeklyData.push({
            date: weekStart,
            critical: Math.round(weekData.reduce((sum, day) => sum + day.critical, 0) / weekData.length),
            legal: Math.round(weekData.reduce((sum, day) => sum + day.legal, 0) / weekData.length),
            total: Math.round(weekData.reduce((sum, day) => sum + day.total, 0) / weekData.length)
          });
        }
      }
      aggregatedData = weeklyData;
    }
    
    return NextResponse.json({
      success: true,
      data: aggregatedData,
      timeframe,
      propertyId: propertyId === 'all' ? 'all' : propertyId
    });
    
  } catch (error) {
    console.error('Risk trend API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch risk trend data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
