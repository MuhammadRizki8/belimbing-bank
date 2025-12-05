import { NextResponse } from 'next/server';
import * as DepositoTypeController from '@/controllers/depositoTypeController';

/**
 * @swagger
 * /api/deposito-types/{id}:
 *   get:
 *     summary: Get a deposito type by ID
 *     tags: [Deposito Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deposito type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepositoType'
 *       404:
 *         description: Deposito type not found
 *       500:
 *         description: Server error
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);
    const depositoType = await DepositoTypeController.getDepositoTypeById(id);
    if (!depositoType) {
      return NextResponse.json({ success: false, message: 'Deposito type not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: depositoType });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/deposito-types/{id}:
 *   put:
 *     summary: Update a deposito type
 *     tags: [Deposito Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *       200:
 *         description: Deposito type updated
 *       404:
 *         description: Deposito type not found
 *       500:
 *         description: Server error
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);
    const body = await request.json();
    const payload = body as { name?: string; yearlyReturn?: number | string };
    const updatedDepositoType = await DepositoTypeController.updateDepositoType(id, payload);
    return NextResponse.json({ success: true, message: 'Deposito type updated', data: updatedDepositoType });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/deposito-types/{id}:
 *   delete:
 *     summary: Delete a deposito type
 *     tags: [Deposito Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deposito type deleted
 *       404:
 *         description: Deposito type not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);
    await DepositoTypeController.deleteDepositoType(id);
    return NextResponse.json({ success: true, message: 'Deposito type deleted', data: null });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
