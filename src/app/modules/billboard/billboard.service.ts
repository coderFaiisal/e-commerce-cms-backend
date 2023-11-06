import { IBillboard } from './billboard.interface';
import { Billboard } from './billboard.model';

const createBillboard = async (
  payload: IBillboard,
): Promise<IBillboard | null> => {
  //! have to implement some logic here.
  const result = await Billboard.create(payload);

  return result;
};

const getSingleBillboard = async (
  billboardId: string,
): Promise<IBillboard | null> => {
  const result = await Billboard.findById(billboardId);

  return result;
};

const updateBillboard = async (
  billboardId: string,
  updatedData: Partial<IBillboard>,
): Promise<IBillboard | null> => {
  const result = await Billboard.findByIdAndUpdate(billboardId, updatedData, {
    new: true,
  });

  return result;
};

const deleteBillboard = async () => {};

export const BillboardService = {
  createBillboard,
  getSingleBillboard,
  updateBillboard,
  deleteBillboard,
};
