import { store, user } from "../../generated/prisma";
import StoreService from "../service/store.service";
import { Request, Response } from "express";
import {
  GenericErrorResponse,
  GenericSuccessResponse,
} from "../types/GenericResponses";

export async function createStore(req: Request, res: Response) {
  try {
    const store: {
      storeName: string;
      address: string;
      overAllRating: number;
      user: Omit<user, "userId">;
    } = req.body;
    const data = await StoreService.createStore(store);
    const responseData: GenericSuccessResponse<store> = {
      success: true,
      message: "Store added successfully",
      data: [data],
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const errorMsg: GenericErrorResponse = {
      success: false,
      message: "failed to create store",
      error: err.message,
    };
    res.status(400).json(errorMsg);
  }
}

export async function getStore(req: Request, res: Response) {
  try {
    const storeId: number = Number(req.params?.storeId);
    const data = await StoreService.getStore(storeId);
    const responseData: GenericSuccessResponse<store> = {
      success: true,
      message: "Store fetched successfully",
      data: [data],
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const errorMsg: GenericErrorResponse = {
      success: false,
      message: "failed to fetch store details",
      error: err.message,
    };
    res.status(400).json(errorMsg);
  }
}

export async function getAllStore(req: Request, res: Response) {
  try {
    const data = await StoreService.getAllStores();
    const responseData: GenericSuccessResponse<store> = {
      success: true,
      message: "Store fetched successfully",
      data: data,
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const errorMsg: GenericErrorResponse = {
      success: false,
      message: "failed to fetch store details",
      error: err.message,
    };
    res.status(400).json(errorMsg);
  }
}

export async function getStoreByOwnerId(req: Request, res: Response) {
  try {
    const ownerId: number = Number(req.params?.ownerId);
    const data = await StoreService.getStore(ownerId);
    const responseData: GenericSuccessResponse<store> = {
      success: true,
      message: "Store fetched successfully",
      data: [data],
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const errorMsg: GenericErrorResponse = {
      success: false,
      message: "failed to fetch store details",
      error: err.message,
    };
    res.status(400).json(errorMsg);
  }
}
