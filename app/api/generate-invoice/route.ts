import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import InvoicePDF from '@/components/InvoicePDF';
import { getNextInvoiceNumber } from '@/lib/invoice-counter';

export async function POST(request: NextRequest) {
  try {
    const { clientName, amount } = await request.json();

    if (!clientName || !amount) {
      return NextResponse.json(
        { error: 'Client name and amount are required' },
        { status: 400 }
      );
    }

    const invoiceNumber = await getNextInvoiceNumber();
    const currentDate = new Date().toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const stream = await renderToStream(
      InvoicePDF({
        invoiceNumber,
        clientName,
        amount,
        date: currentDate,
      })
    );

    const chunks: Uint8Array[] = [];
    const reader = stream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const blob = new Blob(chunks, { type: 'application/pdf' });
    const buffer = await blob.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
