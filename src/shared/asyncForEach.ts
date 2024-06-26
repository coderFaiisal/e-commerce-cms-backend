/* eslint-disable @typescript-eslint/no-explicit-any */
export const asyncForEach = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) {
    throw new Error('Expected an array.');
  }
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

// for (const index in array) {
//   await callback(array[index], parseInt(index), array);
// }
