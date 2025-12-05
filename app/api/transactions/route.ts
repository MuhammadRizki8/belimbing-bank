import { NextResponse } from 'next/server';
import { TransactionController } from '@/controllers/transactionController';
import { mapTransaction } from '@/controllers/_normalizers';

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction (deposit or withdraw)
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [DEPOSIT, WITHDRAW]
 *               accountId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Transaction successful
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { action: string; accountId: number; amount: number; date: string };
    const { action, accountId, amount, date } = body;

    if (!action) return NextResponse.json({ success: false, message: 'Action is required' }, { status: 400 });

    const accId = Number(accountId);
    const amt = Number(amount);
    if (Number.isNaN(accId) || Number.isNaN(amt)) return NextResponse.json({ success: false, message: 'Invalid accountId or amount' }, { status: 400 });

    if (action === 'DEPOSIT') {
      const result = await TransactionController.deposit(accId, amt, date);
      return NextResponse.json({ success: true, message: 'Deposit successful', data: result });
    } else if (action === 'WITHDRAW') {
      const result = await TransactionController.withdraw(accId, amt, date);
      return NextResponse.json({ success: true, message: 'Withdraw successful', data: result });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Server error
 */
export async function GET() {
  try {
    const transactions = await TransactionController.getAll();
    const normalized = transactions.map(mapTransaction);
    return NextResponse.json({ success: true, data: normalized });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
