import { EVENTS, kafka } from "@shared/kafka";

const producer = kafka.producer({
  retry: {
    retries: 5,
  },
});
let producerConnected = false;

export const emitOrderCreated = async (order) => {
  if (!producerConnected) {
    await producer.connect();
    producerConnected = true;
  }

  await producer.send({
    topic: EVENTS.ORDER_CREATED,
    acks: -1,
    messages: [{ key: "order-events", value: JSON.stringify(order) }],
  });
};
