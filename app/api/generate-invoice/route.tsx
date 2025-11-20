import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import InvoicePDF from '@/components/InvoicePDF';
import { getNextInvoiceNumber } from '@/lib/invoice-counter';

interface LineItem {
  paymentMethod: string;
  amount: number;
  details: string;
}

export async function POST(request: NextRequest) {
  try {
    const { clientName, treatmentDate, lineItems } = await request.json();

    if (!clientName || !lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { error: 'Client name and at least one line item are required' },
        { status: 400 }
      );
    }

    const invoiceNumber = await getNextInvoiceNumber();
    const currentDate = new Date().toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const formattedTreatmentDate = treatmentDate
      ? new Date(treatmentDate).toLocaleDateString('he-IL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : currentDate;

    const formattedLineItems = lineItems.map((item: LineItem) => ({
      paymentMethod:
        item.paymentMethod === 'cash'
          ? 'מזומן'
          : item.paymentMethod === 'other'
          ? 'אחר'
          : 'העברה בנקאית',
      amount: item.amount,
      details: item.details || '',
    }));

    const pdfBuffer = await renderToBuffer(
      <InvoicePDF
        invoiceNumber={invoiceNumber}
        clientName={clientName}
        date={currentDate}
        treatmentDate={formattedTreatmentDate}
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
