import { Router } from "express";
import {
  addRating,
  getAll,
  getAllRatings,
  getRating,
  updateRating,
} from "../controller/ratings.controller";

const RatingRouter = Router();

RatingRouter.post("/stores/ratings", addRating);
RatingRouter.put("/:ratingId/ratings/:rating", updateRating);
RatingRouter.get("/stores/:storeId/users/:userId/rating", getRating);
RatingRouter.get("/stores/:storeId/ratings", getAllRatings);
RatingRouter.get("/getAllRatings", getAll);

export default RatingRouter;
