import { successResponse, errorResponse, getErrorMessage } from '@/lib/apiResponse';
import prisma from '@/lib/prisma';

type DepositoTypeBody = { name: string; yearlyReturnRate: number | string };

export async function GET() {
  try {
    const data = await prisma.depositoType.findMany();
    return successResponse(data);
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DepositoTypeBody;
    if (!body?.name) return errorResponse('Name is required', 400);

    const yearlyReturnRate = Number(body.yearlyReturnRate);
    if (Number.isNaN(yearlyReturnRate)) return errorResponse('Invalid yearlyReturnRate', 400);

    const newDepositoType = await prisma.depositoType.create({ data: { name: body.name, yearlyReturnRate } });
    return successResponse(newDepositoType, 'Deposito type created', 201);
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}
