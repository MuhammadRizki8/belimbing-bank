import { getAllDepositoTypes, createDepositoType } from '@/controllers/depositoTypeController';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/deposito-types:
 *   get:
 *     summary: Get all deposito types
 *     tags: [Deposito Types]
 *     responses:
 *       200:
 *         description: A list of deposito types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DepositoType'
 *       500:
 *         description: Server error
 */
export async function GET() {
  try {
    const depositoTypes = await getAllDepositoTypes();
    return NextResponse.json({ success: true, data: depositoTypes });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/deposito-types:
 *   post:
 *     summary: Create a new deposito type
 *     tags: [Deposito Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               interestRate:
 *                 type: number
 *     responses:
 *       201:
 *         description: Deposito type created
 *       500:
 *         description: Server error
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDepositoType = await createDepositoType(body);
    return NextResponse.json({ success: true, message: 'Deposito type created', data: newDepositoType }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
