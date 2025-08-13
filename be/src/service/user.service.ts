import prismaClient from "../db/DbConfig";
import { user, UserType } from "../../generated/prisma";
import {
  INVALID_PASSWORD,
  USER_ALREADY_EXIST,
  USER_DOESNOT_EXIST,
} from "../utils/constants.message";

interface UserServiceType {
  saveUser: (user: Omit<user, "userId">) => Promise<user>;
  validateUser: (user: { email: string; password: string }) => Promise<user>;
  getAllUsers: () => Promise<Array<user>>;
  getAllStoreUsers: () => Promise<Array<user>>;
  getAllSystemUsers: () => Promise<Array<user>>;
  updatePassword: (user: {
    userId: number;
    oldPassword: string;
    newPassword: string;
  }) => Promise<user>;
  getUserByUserID: (userId: number) => Promise<user>;
}

const saveUser = async (user: Omit<user, "userId">): Promise<user> => {
  try {
    const userInDb = await prismaClient.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (userInDb) throw new Error(USER_ALREADY_EXIST);
    const data: user = await prismaClient.user.create({
      data: user,
    });
    return data;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

const validateUser = async (user: {
  email: string;
  password: string;
}): Promise<user> => {
  try {
    const userInDb = await prismaClient.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (!userInDb) throw new Error(USER_DOESNOT_EXIST);

    if (userInDb.password === user.password) return userInDb;
    throw new Error(INVALID_PASSWORD);
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

const getUserByUserID = async (userId:number): Promise<user> => {
  try {
    const userInDb = await prismaClient.user.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!userInDb) throw new Error(USER_DOESNOT_EXIST);

    return userInDb;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

const getAllUsers = async (): Promise<Array<user>> => {
  try {
    const usersInDb = await prismaClient.user.findMany();
    // findMany returns an empty array if no users found, not null/undefined
    return usersInDb;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

const getAllStoreUsers = async (): Promise<Array<user>> => {
  try {
    const usersInDb = await prismaClient.user.findMany({
      where: {
        role: UserType.STORE_OWNER,
      },
    });
    // findMany returns an empty array if no users found, not null/undefined
    return usersInDb;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

const getAllSystemUsers = async (): Promise<Array<user>> => {
  try {
    const usersInDb = await prismaClient.user.findMany({
      where: {
        role: UserType.SYSTEM_ADMINISTRATOR,
      },
    });
    // findMany returns an empty array if no users found, not null/undefined
    return usersInDb;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

const updatePassword = async (user: {
  userId: number;
  oldPassword: string;
  newPassword: string;
}): Promise<user> => {
  try {
    const userInDb = await prismaClient.user.findUnique({
      where: {
        userId: user.userId,
      },
    });
    if (!userInDb) throw new Error(USER_DOESNOT_EXIST);

    if (user.oldPassword !== userInDb.password)
      throw new Error(INVALID_PASSWORD);

    const data: user = await prismaClient.user.update({
      where: { userId: user.userId },
      data: { password: user.newPassword },
    });
    return data;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

const UserService: UserServiceType = {
  saveUser,
  validateUser,
  getAllUsers,
  getAllStoreUsers,
  getAllSystemUsers,
  updatePassword,
  getUserByUserID
};

export default UserService;
