import cors from "cors";
import express, { json, urlencoded } from "express";
import { orderController } from "./controllers/order.controller.js";

const port = process.env.PORT || 3001;

const app = express();

app
  .use(urlencoded({ extended: true }))
  .use(json())
  .use(cors());

app.post("/order", orderController);

app.listen(port, () => {
  console.log(`api running on ${port}`);
});
