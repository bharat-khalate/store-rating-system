import { Router } from "express";
import {
  createStore,
  getAllStore,
  getStore,
  getStoreByOwnerId,
} from "../controller/store.controller";

const StoreRouter = Router();

StoreRouter.post("/create", createStore);
StoreRouter.get("/getStore/:storeId", getStore);
StoreRouter.get("/getAllStore", getAllStore);
StoreRouter.get("/getStoreByOwnerID/:ownerId", getStoreByOwnerId);

export default StoreRouter;
