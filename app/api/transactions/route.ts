import { successResponse, errorResponse, getErrorMessage } from '@/lib/apiResponse';
import { TransactionController } from '@/controllers/transactionController';

type TransactionRequest = {
  action: 'DEPOSIT' | 'WITHDRAW' | string;
  accountId: number | string;
  amount: number | string;
  date: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TransactionRequest;
    const { action, accountId, amount, date } = body;

    if (!action) return errorResponse('Action is required', 400);

    const accId = Number(accountId);
    const amt = Number(amount);
    if (Number.isNaN(accId) || Number.isNaN(amt)) return errorResponse('Invalid accountId or amount', 400);

    if (action === 'DEPOSIT') {
      const result = await TransactionController.deposit(accId, amt, date);
      return successResponse(result, 'Deposit successful');
    } else if (action === 'WITHDRAW') {
      const result = await TransactionController.withdraw(accId, amt, date);
      return successResponse(result, 'Withdraw successful');
    }

    return errorResponse('Invalid action', 400);
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}
