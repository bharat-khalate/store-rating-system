import prismaClient from "../db/DbConfig";
import { ratings, store, user } from "../../generated/prisma";
import { create } from "domain";

interface StoreServiceType {
  createStore: (store: {
    storeName: string;
    address: string;
    overAllRating: number;
    user: Omit<user, "userId">;
  }) => Promise<store>;
  getStore: (storeId: number) => Promise<store>;
  setRating: (storeData: { rating: number; storeId: number }) => Promise<store>;
  getAllStores: () => Promise<store[]>;
  getStoreByOwnerId: (ownerId: number) => Promise<store>;
}

async function createStore(store: {
  storeName: string;
  address: string;
  overAllRating: number;
  user: Omit<user, "userId">;
}) {
  try {
    const res = await prismaClient.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: store.user,
      });
      const storeData = await tx.store.create({
        data: {
          storeName: store.storeName,
          address: store.address,
          overAllRating: 0,
          ownerId: user.userId,
        },
      });
      return storeData;
    });
    // const data = await prismaClient.store.create({
    //   data: {
    //     storeName: store.storeName,
    //     address: store.address,
    //     overAllRating: 0,
    //     owner: {
    //       create: store.user,
    //     },
    //   },
    // });
    return res;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
}

async function getStore(storeId: number) {
  try {
    const data: store | null = await prismaClient.store.findFirst({
      where: { storeId: storeId },
      include: { owner: true, ratings: true },
    });
    if (!data) throw new Error("Store Not Found");
    return data;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
}

async function getAllStores() {
  try {
    const data: store[] = await prismaClient.store.findMany({
      include: { owner: true, ratings: true },
    });
    if (!data) throw new Error("Store Not Found");
    return data;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
}

async function setRating(storeData: { rating: number; storeId: number }) {
  try {
    const data: store = await prismaClient.store.update({
      where: { storeId: storeData.storeId },
      data: { overAllRating: storeData.rating },
    });
    return data;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}

async function getStoreByOwnerId(ownerId: number) {
  try {
    const data: store | null = await prismaClient.store.findFirst({
      where: { ownerId: ownerId },
    });
    if (!data) throw new Error("No such store found");
    return data;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
}

const StoreService: StoreServiceType = {
  createStore,
  getStore,
  getAllStores,
  setRating,
  getStoreByOwnerId,
};

export default StoreService;
