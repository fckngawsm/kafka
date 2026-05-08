import { Kafka, logLevel } from "kafkajs";

export const kafka = new Kafka({
  clientId: "kafka-app",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092,localhost:9093").split(","),
  logLevel: logLevel.ERROR,
});
