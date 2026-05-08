import cors from "cors";
import express, { json, urlencoded } from "express";
import { connectConsumer } from "./consumer/consumer.js";

const port = process.env.PORT || 3003;

const app = express();

app
  .use(urlencoded({ extended: true }))
  .use(json())
  .use(cors());

await connectConsumer();

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "analytics" });
});

app.listen(port, () => {
  console.log(`api running on ${port}`);
});
