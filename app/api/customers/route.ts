import { successResponse, errorResponse, getErrorMessage } from '@/lib/apiResponse';
import { CustomerController } from '@/controllers/customerController';

type CustomerCreateBody = { name: string };

export async function GET() {
  try {
    const data = await CustomerController.getAll();
    return successResponse(data);
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CustomerCreateBody;
    if (!body?.name) return errorResponse('Name is required', 400);

    const data = await CustomerController.create(body.name);
    return successResponse(data, 'Customer created', 201);
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}
