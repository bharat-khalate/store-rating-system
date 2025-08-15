import { Request, Response } from "express";
import { user } from "../../generated/prisma";
import UserService from "../service/user.service";
import {
  GenericErrorResponse,
  GenericSuccessResponse,
} from "../types/GenericResponses";

// Helper to hide sensitive data like password from response
function sanitizeUser(user: user): Omit<user, "password"> {
  const { password, ...sanitizedUser } = user as user & { password?: string };
  return sanitizedUser;
}

export async function register(req: Request, res: Response) {
  const user: Omit<user, "userId"> = req.body;
  try {
    const data: user = await UserService.saveUser(user);
    const sanitizedUser = sanitizeUser(data);
    const responseData: GenericSuccessResponse<Omit<user, "password">> = {
      success: true,
      message: "User Created Successfully",
      data: [sanitizedUser],
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const responseMessage: GenericErrorResponse = {
      success: false,
      message: "Failed to create User",
      error: err.message,
    };
    res.status(400).json(responseMessage);
  }
}

export async function authenticateUser(req: Request, res: Response) {
  const user: { email: string; password: string } = req.body;
  try {
    const data: user = await UserService.validateUser(user);
    const sanitizedUser = sanitizeUser(data);
    const responseData: GenericSuccessResponse<Omit<user, "password">> = {
      success: true,
      message: "Login Successfull",
      data: [sanitizedUser],
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const responseMessage: GenericErrorResponse = {
      success: false,
      message: "Failed to Log In",
      error: err.message,
    };
    res.status(400).json(responseMessage);
  }
}

export async function getUserByUserId(req: Request, res: Response) {
  const {userId} =req.params;
  try {
    const data: user = await UserService.getUserByUserID(Number(userId));
    const sanitizedUser = sanitizeUser(data);
    const responseData: GenericSuccessResponse<Omit<user, "password">> = {
      success: true,
      message: "User Fetched",
      data: [sanitizedUser],
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const responseMessage: GenericErrorResponse = {
      success: false,
      message: "Failed to fetch User",
      error: err.message,
    };
    res.status(400).json(responseMessage);
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const data: user[] = await UserService.getAllUsers();
    const sanitizedUsers = data?.map((users) => sanitizeUser(users));
    const responseData: GenericSuccessResponse<Omit<user, "password">> = {
      success: true,
      message: "Users Found",
      data: sanitizedUsers,
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const responseMessage: GenericErrorResponse = {
      success: false,
      message: "Failed to get all users",
      error: err.message,
    };
    res.status(400).json(responseMessage);
  }
}

export async function getAllStoreUsers(req: Request, res: Response) {
  try {
    const data: user[] = await UserService.getAllStoreUsers();
    const sanitizedUsers = data?.map((users) => sanitizeUser(users));
    const responseData: GenericSuccessResponse<Omit<user, "password">> = {
      success: true,
      message: "Users Found",
      data: sanitizedUsers,
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const responseMessage: GenericErrorResponse = {
      success: false,
      message: "Failed to Fetch all store users",
      error: err.message,
    };
    res.status(400).json(responseMessage);
  }
}

export async function getAllSystemUsers(req: Request, res: Response) {
  try {
    const data: user[] = await UserService.getAllSystemUsers();
    const sanitizedUsers = data?.map((users) => sanitizeUser(users));
    const responseData: GenericSuccessResponse<Omit<user, "password">> = {
      success: true,
      message: "Users Found",
      data: sanitizedUsers,
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const responseMessage: GenericErrorResponse = {
      success: false,
      message: "Failed to Fetch all system users",
      error: err.message,
    };
    res.status(400).json(responseMessage);
  }
}

export async function updatePassword(req: Request, res: Response) {
  const user: {
    userId: number;
    oldPassword: string;
    newPassword: string;
  } = req.body;
  try {
    const data: user = await UserService.updatePassword(user);
    const sanitizedUser = sanitizeUser(data);
    const responseData: GenericSuccessResponse<Omit<user, "password">> = {
      success: true,
      message: "Password Updated Successfully",
      data: [sanitizedUser],
    };
    res.status(200).json(responseData);
  } catch (err: any) {
    console.error(err.message);
    const responseMessage: GenericErrorResponse = {
      success: false,
      message: "Failed to update Password",
      error: err.message,
    };
    res.status(400).json(responseMessage);
  }
}
