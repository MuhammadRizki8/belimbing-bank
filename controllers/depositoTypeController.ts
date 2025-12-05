import prisma from '@/lib/prisma';
import { mapDepositoType } from './_normalizers';

export const getAllDepositoTypes = async () => {
  const list = await prisma.depositoType.findMany();
  return list.map(mapDepositoType);
};

export const createDepositoType = async (data: any) => {
  const d = await prisma.depositoType.create({ data });
  return mapDepositoType(d);
};

export const getDepositoTypeById = async (id: number) => {
  const d = await prisma.depositoType.findUnique({ where: { id } });
  return mapDepositoType(d);
};

export const updateDepositoType = async (id: number, data: any) => {
  const d = await prisma.depositoType.update({ where: { id }, data });
  return mapDepositoType(d);
};

export const deleteDepositoType = async (id: number) => {
  const accounts = await prisma.account.findMany({ where: { depositoTypeId: id } });

  if (accounts.length > 0) {
    throw new Error('Cannot delete deposito type with associated accounts.');
  }

  const d = await prisma.depositoType.delete({ where: { id } });
  return mapDepositoType(d);
};
