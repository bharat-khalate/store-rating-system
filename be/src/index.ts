import express, { Express } from "express";
import cors from "cors";
import { BASE_ROUTE } from "./utils/constants.message";
import UserRouter from "./routes/user.routes";
import RatingRouter from "./routes/rating.route";
import StoreRouter from "./routes/store.route";

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use(`${BASE_ROUTE}users`, UserRouter);
app.use(`${BASE_ROUTE}ratings`, RatingRouter);
app.use(`${BASE_ROUTE}store`, StoreRouter);


app.get("/",(req,res)=>{
    res.end("hello world")
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server Started on ", port);
});
