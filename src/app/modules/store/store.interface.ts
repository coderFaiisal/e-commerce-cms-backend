/* eslint-disable no-unused-vars */
export type IStore = {
  name: string;
};

export type StoreModel = {
  isStoreExist(id: string): boolean;
} & IStore;
