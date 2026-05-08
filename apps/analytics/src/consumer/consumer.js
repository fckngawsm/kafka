import { EVENTS, kafka } from "@shared/kafka";

const consumer = kafka.consumer({
  groupId: "analytics-service",
  maxBytesPerPartition: 1024 * 1024,
});
const batchBuffer = [];
const batchSize = 10;

export const connectConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topics: [EVENTS.ORDER_CREATED],
  });

  await consumer.run({
    autoCommit: false,
    eachBatchAutoResolve: false,
    eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
      const messages = batch.messages;

      console.log(
        `analytics batch received: topic=${batch.topic}, partition=${batch.partition}, size=${messages.length}`
      );

      if (!messages.length) {
        return;
      }

      for (const message of messages) {
        batchBuffer.push(message);

        resolveOffset(message.offset);
        await heartbeat();

        if (batchBuffer.length === batchSize) {
          console.log(
            `analytics processing buffered batch: size=${batchBuffer.length}`
          );

          for (const bufferedMessage of batchBuffer) {
            console.log(bufferedMessage.value.toString());
          }

          batchBuffer.length = 0;
        }
      }

      await consumer.commitOffsets([
        {
          topic: batch.topic,
          partition: batch.partition,
          offset: (
            BigInt(messages[messages.length - 1].offset) + 1n
          ).toString(),
        },
      ]);

      console.log(
        `analytics offsets committed: received=${messages.length}, buffered=${batchBuffer.length}`
      );
    },
  });
};
