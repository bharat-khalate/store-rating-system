import RatingService from "../service/ratings.service";
import { Request, Response } from "express";
import {
  GenericErrorResponse,
  GenericSuccessResponse,
} from "../types/GenericResponses";
import { ratings } from "../../generated/prisma";

export async function addRating(req: Request, res: Response) {
  try {
    const rating: Omit<ratings, "ratingId"> = req.body;
    const data = await RatingService.addRating(rating);
    const responseData: GenericSuccessResponse<ratings> = {
      success: true,
      message: "Thank you for giving rating",
      data: [data],
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const responseData: GenericErrorResponse = {
      success: false,
      message: "failed to add rating",
      error: err.message,
    };
    res.status(200).json(responseData);
  }
}

export async function updateRating(req: Request, res: Response) {
  try {
    const { ratingId, rating } = req.params;

    const data = await RatingService.updateRating(
      Number(ratingId),
      Number(rating)
    );
    const responseData: GenericSuccessResponse<ratings> = {
      success: true,
      message: "Thank you for giving rating",
      data: [data],
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const responseData: GenericErrorResponse = {
      success: false,
      message: "failed to add rating",
      error: err.message,
    };
    res.status(200).json(responseData);
  }
}

export async function getRating(req: Request, res: Response) {
  try {
    const { storeId, userId } = req.params;

    const data = await RatingService.getRating({
      storeId: Number(storeId),
      userId: Number(userId),
    });
    const responseData: GenericSuccessResponse<ratings> = {
      success: true,
      message: "Rating fetched",
      data: [data],
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const responseData: GenericErrorResponse = {
      success: false,
      message: "failed to add rating",
      error: err.message,
    };
    res.status(200).json(responseData);
  }
}

export async function getAllRatings(req: Request, res: Response) {
  try {
    const { storeId } = req.params;

    const data = await RatingService.getAllRating(Number(storeId));
    const responseData: GenericSuccessResponse<ratings> = {
      success: true,
      message: "Rating fetched",
      data: data,
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const responseData: GenericErrorResponse = {
      success: false,
      message: "failed to add rating",
      error: err.message,
    };
    res.status(200).json(responseData);
  }
}


export async function getAll(req: Request, res: Response) {
  try {


    const data = await RatingService.getAll();
    const responseData: GenericSuccessResponse<ratings> = {
      success: true,
      message: "Rating fetched",
      data: data,
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const responseData: GenericErrorResponse = {
      success: false,
      message: "failed to add rating",
      error: err.message,
    };
    res.status(200).json(responseData);
  }
}
