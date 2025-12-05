import { successResponse, errorResponse, getErrorMessage } from '@/lib/apiResponse';
import { CustomerController } from '@/controllers/customerController';

type CustomerCreateBody = { name: string };

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '8', 10);

    const data = await CustomerController.getAll(search, page, pageSize);
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
