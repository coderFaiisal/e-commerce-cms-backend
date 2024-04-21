import { Types } from 'mongoose';
import { TCategory } from '../category/type';
import { Product } from './model';

const findLastProductCode = async (
  categoryId: Types.ObjectId,
): Promise<string | undefined> => {
  const lastProduct = await Product.findOne(
    {
      categoryId,
    },
    { productCode: 1, _id: -1 },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastProduct?.productCode
    ? lastProduct.productCode.substring(2)
    : undefined;
};

export const generateProductCode = async (
  category: TCategory & { _id: Types.ObjectId },
): Promise<string> => {
  const { code: categoryCode, _id: categoryId } = category;

  const currentCode =
    (await findLastProductCode(categoryId)) || (0).toString().padStart(5, '0');

  //increment by 1
  let incrementedCode = (parseInt(currentCode) + 1).toString().padStart(5, '0');

  incrementedCode = `${categoryCode}${incrementedCode}`;

  return incrementedCode;
};
