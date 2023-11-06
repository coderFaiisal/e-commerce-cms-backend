import { ICategory } from './category.interface';
import { Category } from './category.model';

export const createCategory = async (
  payload: ICategory,
): Promise<ICategory | null> => {
  const result = await Category.create(payload);

  return result;
};

export const CategoryService = {
  createCategory,
};
