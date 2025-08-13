import { PrismaClient } from "../../generated/prisma";

const prismaClient = new PrismaClient({
  log: ["query"],
});

export default prismaClient;
