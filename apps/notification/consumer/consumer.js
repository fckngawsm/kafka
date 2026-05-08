import { EVENTS, kafka } from "@shared/kafka";

const consumer = kafka.consumer({ groupId: "notification-service" });

export const connectConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topics: [EVENTS.ORDER_CREATED],
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const event = JSON.parse(message.value.toString());

      switch (topic) {
        case EVENTS.ORDER_CREATED:
          console.log(`Sending Order Confirmation to User ${event}`);
          break;
        default:
          console.log(`event ${JSON.stringify(event)} not registered`);
      }
    },
  });
};
