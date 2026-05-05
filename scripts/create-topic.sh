#!/bin/sh
set -e

BROKER="kafka-1:29092,kafka-2:29093"
KAFKA_TOPICS="/opt/bitnami/kafka/bin/kafka-topics.sh"

echo "Waiting for Kafka..."

until $KAFKA_TOPICS --bootstrap-server "$BROKER" --list >/dev/null 2>&1; do
  sleep 2
done

echo "Creating topics..."

$KAFKA_TOPICS \
  --bootstrap-server "$BROKER" \
  --create \
  --if-not-exists \
  --topic order-events \
  --partitions 3 \
  --replication-factor 2

echo "Topics created."
