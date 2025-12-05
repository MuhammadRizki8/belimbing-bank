import { successResponse, errorResponse, getErrorMessage } from '@/lib/apiResponse';
import { CustomerController } from '@/controllers/customerController';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);
    const customer = await CustomerController.getById(id);
    return successResponse(customer);
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);
    const body = await request.json();
    const updatedCustomer = await CustomerController.update(id, body);
    return successResponse(updatedCustomer, 'Customer updated');
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);
    await CustomerController.delete(id);
    return successResponse(null, 'Customer deleted');
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error));
  }
}
