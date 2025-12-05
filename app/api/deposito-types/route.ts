import { getAllDepositoTypes, createDepositoType } from '@/controllers/depositoTypeController';
import { successResponse, errorResponse, getErrorMessage } from '@/lib/apiResponse';

export async function GET() {
  try {
    const depositoTypes = await getAllDepositoTypes();
    return successResponse(depositoTypes);
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDepositoType = await createDepositoType(body);
    return successResponse(newDepositoType, 'Deposito type created', 201);
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}
