import prismaClient from "../db/DbConfig";
import { ratings, store } from "../../generated/prisma";
import { promises } from "dns";
import StoreService from "./store.service";

interface RatingServiceType {
  addRating: (rating: Omit<ratings, "ratingId">) => Promise<ratings>;
  updateRating: (ratingId: number, rating: number) => Promise<ratings>;
  getRating: (rating: { storeId: number; userId: number }) => Promise<ratings|null>;
  getAllRating: (storeId: number) => Promise<ratings[]>;
  getAll:()=>Promise<ratings[]>
}

async function addRating(rating: Omit<ratings, "ratingId">) {
  try {
    const result = await prismaClient.$transaction(async (tx) => {
      const newRating = await tx.ratings.create({
        data: rating,
      });
      const totalRating = await tx.ratings.aggregate({
        where: { storeId: rating.storeId },
        _avg: {
          rating: true,
        },
      });
      const finalRating = Math.round(totalRating._avg.rating || 0);
      await tx.store.update({
        where: { storeId: rating.storeId },
        data: { overAllRating: finalRating },
      });

      return newRating;
    });
    return result;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}

async function updateRating(ratingId: number, rating: number) {
  try {
    const result = await prismaClient.$transaction(async (tx) => {
      const newRating = await tx.ratings.update({
        where: { ratingId: ratingId },
        data: { rating: rating },
      });
      const totalRating = await tx.ratings.aggregate({
        where: { storeId: newRating.storeId },
        _avg: {
          rating: true,
        },
      });
      const finalRating = Math.round(totalRating._avg.rating || 0);
      await tx.store.update({
        where: { storeId: newRating.storeId },
        data: { overAllRating: finalRating },
      });

      return newRating;
    });
    return result;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}

async function getRating(rating: { storeId: number; userId: number }) {
  try {
    const data: ratings | null = await prismaClient.ratings.findFirst({
      where: {
        storeId: rating.storeId,
        userId: rating.userId,
      },
    });
    return data;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}

async function getAllRating(storeId: number) {
  try {
    const data: ratings[] = await prismaClient.ratings.findMany({
      where: {
        storeId: storeId,
      },
    });
    if (!data) {
      throw new Error("No ratings, Yet");
    }
    return data;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}

async function getAll() {
  try {
    const data: ratings[] = await prismaClient.ratings.findMany();
    if (!data) {
      throw new Error("No ratings, Yet");
    }
    return data;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}

const RatingService: RatingServiceType = {
  addRating,
  updateRating,
  getRating,
  getAllRating,
  getAll
};

export default RatingService;
