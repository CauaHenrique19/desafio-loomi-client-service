import { Kafka, Message, Producer } from 'kafkajs';

import {
  MessageBroker,
  SendMessageParameters,
} from '@client-service/data/protocols/message-broker/message-broker';
import { CONFIG } from '@client-service/config';

export class KafkaMessageBrokerAdapter implements MessageBroker {
  private producer: Producer;

  constructor() {
    this.connect();
  }

  async sendMessage<T>(props: SendMessageParameters<T>): Promise<void> {
    const messages = this.parseMessages(props.message);

    await this.producer.send({
      topic: props.topicName,
      messages,
    });
  }

  private async connect() {
    const kafka = new Kafka({
      clientId: CONFIG.SERVICE_NAME,
      brokers: [CONFIG.KAFKA_BROKER_HOST],
    });

    this.producer = kafka.producer();
    await this.producer.connect();
  }

  private parseMessages(message: unknown | unknown[]): Message[] {
    if (Array.isArray(message)) {
      return message.map((m) => ({
        value: JSON.stringify(m),
      }));
    }

    return [{ value: JSON.stringify(message) }];
  }
}
