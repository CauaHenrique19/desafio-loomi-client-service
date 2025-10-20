import { SendMessageParameters } from '@client-service/data/protocols/message-broker/message-broker';
import { KafkaMessageBrokerAdapter } from '@client-service/infra/kafka/adapter';

const producerMock = {
  connect: jest.fn(),
  send: jest.fn(),
};

jest.mock('kafkajs', () => {
  return {
    Kafka: jest.fn().mockImplementation(() => ({
      producer: () => producerMock,
    })),
  };
});

describe('KafkaMessageBrokerAdapter', () => {
  const makeSut = (): KafkaMessageBrokerAdapter => {
    return new KafkaMessageBrokerAdapter();
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const singleMessage: SendMessageParameters<{ text: string }> = {
    topicName: 'test-topic',
    message: { text: 'Hello Kafka' },
  };

  const multipleMessages: SendMessageParameters<{ text: string }[]> = {
    topicName: 'test-topic',
    message: [{ text: 'msg1' }, { text: 'msg2' }],
  };

  test('Should connect producer on instantiation', async () => {
    makeSut();
    expect(producerMock.connect).toHaveBeenCalledTimes(1);
  });

  test('Should send a single message correctly', async () => {
    const sut = makeSut();

    await sut.sendMessage(singleMessage);

    expect(producerMock.send).toHaveBeenCalledWith({
      topic: singleMessage.topicName,
      messages: [{ value: JSON.stringify(singleMessage.message) }],
    });
    expect(producerMock.send).toHaveBeenCalledTimes(1);
  });

  test('Should send multiple messages correctly', async () => {
    const sut = makeSut();

    await sut.sendMessage(multipleMessages);

    expect(producerMock.send).toHaveBeenCalledWith({
      topic: multipleMessages.topicName,
      messages: multipleMessages.message.map((m) => ({
        value: JSON.stringify(m),
      })),
    });
    expect(producerMock.send).toHaveBeenCalledTimes(1);
  });

  test('Should throw if producer.send fails', async () => {
    const sut = makeSut();

    producerMock.send.mockRejectedValueOnce(new Error('Kafka Error'));

    await expect(sut.sendMessage(singleMessage)).rejects.toThrow('Kafka Error');
  });
});
