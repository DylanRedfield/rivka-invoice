import { createClient } from 'redis';

const INVOICE_COUNTER_KEY = 'invoice_counter';
const STARTING_INVOICE_NUMBER = 80003;

let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    await redisClient.connect();
  }
  return redisClient;
}

export async function getNextInvoiceNumber(): Promise<number> {
  try {
    const client = await getRedisClient();
    const currentNumber = await client.get(INVOICE_COUNTER_KEY);

    if (currentNumber === null) {
      await client.set(INVOICE_COUNTER_KEY, String(STARTING_INVOICE_NUMBER + 1));
      return STARTING_INVOICE_NUMBER;
    }

    const nextNumber = parseInt(currentNumber, 10);
    await client.set(INVOICE_COUNTER_KEY, String(nextNumber + 1));

    return nextNumber;
  } catch (error) {
    console.error('Error accessing Redis:', error);
    return Date.now();
  }
}
