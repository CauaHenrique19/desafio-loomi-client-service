export interface SendMessageParameters<T> {
  topicName: string;
  message: T | T[];
}

export interface MessageBroker {
  sendMessage<T>(props: SendMessageParameters<T>): Promise<void>;
}
