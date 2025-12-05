import { successResponse, errorResponse, getErrorMessage } from '@/lib/apiResponse';
import { AccountController } from '@/controllers/accountController';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);
    const account = await AccountController.getById(id);
    return successResponse(account);
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);
    const body = (await request.json()) as Partial<{
      customerId: number | string;
      depositoTypeId: number | string;
      balance: number | string;
    }>;

    const updateData: any = {};
    if (body.customerId !== undefined) {
      const v = Number(body.customerId);
      if (Number.isNaN(v)) return errorResponse('Invalid customerId', 400);
      updateData.customerId = v;
    }
    if (body.depositoTypeId !== undefined) {
      const v = Number(body.depositoTypeId);
      if (Number.isNaN(v)) return errorResponse('Invalid depositoTypeId', 400);
      updateData.depositoTypeId = v;
    }
    if (body.balance !== undefined) {
      const v = Number(body.balance);
      if (Number.isNaN(v)) return errorResponse('Invalid balance', 400);
      updateData.balance = v;
    }

    const updatedAccount = await AccountController.update(id, updateData as any);
    return successResponse(updatedAccount, 'Account updated');
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);
    await AccountController.delete(id);
    return successResponse(null, 'Account deleted');
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}
