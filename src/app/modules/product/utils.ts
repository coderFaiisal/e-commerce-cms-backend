import { Product } from './model';

const findLastProductCode = async (): Promise<string | undefined> => {
  const lastProduct = await Product.findOne({}, { productCode: 1, _id: -1 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastProduct?.productCode
    ? lastProduct.productCode.substring(2)
    : undefined;
};

export const generateProductCode = async (
  categoryCode: string,
): Promise<string> => {
  const currentCode =
    (await findLastProductCode()) || (0).toString().padStart(5, '0');

  //increment by 1
  let incrementedCode = (parseInt(currentCode) + 1).toString().padStart(5, '0');

  incrementedCode = `${categoryCode}${incrementedCode}`;

  return incrementedCode;
};
