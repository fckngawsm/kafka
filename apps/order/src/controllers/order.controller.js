import { emitOrderCreated } from "../../producer/producer.js";

export const orderController = async (req, res) => {
  const order = req.body;

  await emitOrderCreated(order);

  return res.json({ message: "Заказ успешно создан!" });
};
