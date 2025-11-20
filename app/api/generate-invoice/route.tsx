import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import InvoicePDF from '@/components/InvoicePDF';
import { getNextInvoiceNumber } from '@/lib/invoice-counter';

interface LineItem {
  paymentMethod: string;
  amount: number;
  details: string;
  date: string;
}

export async function POST(request: NextRequest) {
  try {
    const { clientName, documentDate, lineItems } = await request.json();

    if (!clientName || !lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { error: 'Client name and at least one line item are required' },
        { status: 400 }
      );
    }

    const invoiceNumber = await getNextInvoiceNumber();

    const formattedDocumentDate = documentDate
      ? new Date(documentDate).toLocaleDateString('he-IL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : new Date().toLocaleDateString('he-IL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

    const formattedLineItems = lineItems.map((item: LineItem) => ({
      paymentMethod:
        item.paymentMethod === 'cash'
          ? 'מזומן'
          : item.paymentMethod === 'other'
          ? 'אחר'
          : 'העברה בנקאית',
      amount: item.amount,
      details: item.details || '',
      date: item.date
        ? new Date(item.date).toLocaleDateString('he-IL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : formattedDocumentDate,
    }));

    const pdfBuffer = await renderToBuffer(
      <InvoicePDF
        invoiceNumber={invoiceNumber}
        clientName={clientName}
        documentDate={formattedDocumentDate}
        lineItems={formattedLineItems}
      />
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
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
