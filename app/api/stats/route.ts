import { StatsController } from '@/controllers/statsController';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get application statistics
 *     tags: [Stats]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: The number of days to get stats for
 *     responses:
 *       200:
 *         description: Statistics data
 *       500:
 *         description: Server error
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);

    const stats = await StatsController.getStats(days);
    return NextResponse.json({ success: true, data: stats });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, message: errorMessage },
      {
        status: 500,
      }
    );
  }
}
