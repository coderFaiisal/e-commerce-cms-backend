import { IBillboard } from './billboard.interface';
import { Billboard } from './billboard.model';

const createBillboard = async (
  payload: IBillboard,
): Promise<IBillboard | null> => {
  const result = await Billboard.create(payload);

  return result;
};

const getSingleBillboard = async (
  billboardId: string,
): Promise<IBillboard | null> => {
  const result = await Billboard.findById(billboardId);

  return result;
};

const updateBillboard = async () => {};

const deleteBillboard = async () => {};

export const BillboardService = {
  createBillboard,
  getSingleBillboard,
  updateBillboard,
  deleteBillboard,
};
