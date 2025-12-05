import { successResponse, errorResponse, getErrorMessage } from '@/lib/apiResponse';
import * as DepositoTypeController from '@/controllers/depositoTypeController';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);
    const depositoType = await DepositoTypeController.getDepositoTypeById(id);
    return successResponse(depositoType);
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);
    const body = await request.json();
    const updatedDepositoType = await DepositoTypeController.updateDepositoType(id, body as any);
    return successResponse(updatedDepositoType, 'Deposito type updated');
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);
    await DepositoTypeController.deleteDepositoType(id);
    return successResponse(null, 'Deposito type deleted');
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}
