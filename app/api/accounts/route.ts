import { NextResponse } from 'next/server';
import { AccountController } from '@/controllers/accountController';

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: A list of accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Account'
 *       500:
 *         description: Server error
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '10');
    const data = await AccountController.getAll(page, pageSize);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: integer
 *               depositoTypeId:
 *                 type: integer
 *               balance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Account created
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { customerId: number; depositoTypeId: number; balance: number };

    const customerId = Number(body.customerId);
    const depositoTypeId = Number(body.depositoTypeId);
    const balance = Number(body.balance);

    if (Number.isNaN(customerId) || Number.isNaN(depositoTypeId) || Number.isNaN(balance)) {
      return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 });
    }

    const data = await AccountController.create(customerId, depositoTypeId, balance);
    return NextResponse.json({ success: true, message: 'Account created', data }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
