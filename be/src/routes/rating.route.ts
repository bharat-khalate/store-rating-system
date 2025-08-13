import { Router } from "express";
import {
  addRating,
  getAllRatings,
  getRating,
  updateRating,
} from "../controller/ratings.controller";

const RatingRouter = Router();

RatingRouter.post("/stores/:storeId/ratings", addRating);
RatingRouter.put("/ratings/:ratingId", updateRating);
RatingRouter.get("/stores/:storeId/users/:userId/rating", getRating);
RatingRouter.get("/stores/:storeId/ratings", getAllRatings);

export default RatingRouter;
