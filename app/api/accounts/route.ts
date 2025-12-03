import { successResponse, errorResponse, getErrorMessage } from '@/lib/apiResponse';
import { AccountController } from '@/controllers/accountController';

type AccountCreateBody = {
  customerId: number | string;
  depositoTypeId: number | string;
  balance: number | string;
};

export async function GET() {
  try {
    const data = await AccountController.getAll();
    return successResponse(data);
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AccountCreateBody;

    const customerId = Number(body.customerId);
    const depositoTypeId = Number(body.depositoTypeId);
    const balance = Number(body.balance);

    if (Number.isNaN(customerId) || Number.isNaN(depositoTypeId) || Number.isNaN(balance)) {
      return errorResponse('Invalid request body', 400);
    }

    const data = await AccountController.create(customerId, depositoTypeId, balance);
    return successResponse(data, 'Account created', 201);
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}
