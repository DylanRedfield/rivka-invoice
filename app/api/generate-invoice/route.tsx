import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import InvoicePDF from '@/components/InvoicePDF';
import { getNextInvoiceNumber } from '@/lib/invoice-counter';

export async function POST(request: NextRequest) {
  try {
    const { clientName, amount, treatmentDate, paymentMethod } = await request.json();

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

    const formattedTreatmentDate = treatmentDate
      ? new Date(treatmentDate).toLocaleDateString('he-IL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : currentDate;

    const paymentMethodText = paymentMethod === 'cash' ? 'מזומן' : 'העברה בנקאית';

    const pdfBuffer = await renderToBuffer(
      <InvoicePDF
        invoiceNumber={invoiceNumber}
        clientName={clientName}
        amount={amount}
        date={currentDate}
        treatmentDate={formattedTreatmentDate}
        paymentMethod={paymentMethodText}
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
