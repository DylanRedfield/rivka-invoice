import { kv } from '@vercel/kv';

const INVOICE_COUNTER_KEY = 'invoice_counter';
const STARTING_INVOICE_NUMBER = 80003;

export async function getNextInvoiceNumber(): Promise<number> {
  try {
    const currentNumber = await kv.get<number>(INVOICE_COUNTER_KEY);

    if (currentNumber === null) {
      await kv.set(INVOICE_COUNTER_KEY, STARTING_INVOICE_NUMBER + 1);
      return STARTING_INVOICE_NUMBER;
    }

    const nextNumber = currentNumber;
    await kv.set(INVOICE_COUNTER_KEY, nextNumber + 1);

    return nextNumber;
  } catch (error) {
    console.error('Error accessing KV store:', error);
    return Date.now();
  }
}
