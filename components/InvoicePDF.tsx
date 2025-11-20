import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Noto Sans Hebrew',
  src: 'https://fonts.gstatic.com/s/notosanshebrew/v45/or3HQ7v33eiDljA1IufXTtVf7V6RvEEdhQlk0LlGxCyaeNKYZC0sqk3xXGiXd4utoiJltutR2g.ttf',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Noto Sans Hebrew',
  },
  header: {
    flexDirection: 'row-reverse',
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  leftInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontSize: 10,
    gap: 3,
  },
  rightBox: {
    backgroundColor: '#7B94B0',
    padding: 15,
    borderRadius: 3,
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: 200,
  },
  invoiceTitle: {
    fontSize: 11,
    color: '#ffffff',
    marginBottom: 5,
    textAlign: 'right',
  },
  businessName: {
    fontSize: 9,
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'right',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  invoiceLabel: {
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'right',
  },
  table: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#000000',
  },
  tableHeader: {
    flexDirection: 'row-reverse',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row-reverse',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    padding: 8,
  },
  tableCol1: {
    width: '33.33%',
    textAlign: 'right',
    fontSize: 10,
  },
  tableCol2: {
    width: '33.33%',
    textAlign: 'right',
    fontSize: 10,
  },
  tableCol3: {
    width: '33.34%',
    textAlign: 'right',
    fontSize: 10,
  },
  totalRow: {
    flexDirection: 'row-reverse',
    backgroundColor: '#7B94B0',
    padding: 8,
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 10,
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'right',
  },
  dateText: {
    fontSize: 9,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'right',
  },
});

interface InvoicePDFProps {
  invoiceNumber: number;
  clientName: string;
  amount: number;
  date: string;
  treatmentDate: string;
  paymentMethod: string;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({
  invoiceNumber,
  clientName,
  amount,
  date,
  treatmentDate,
  paymentMethod
}) => {
  const formattedAmount = `₪${amount.toFixed(2)}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.rightBox}>
            <Text style={styles.dateText}>{date}</Text>
            <Text style={styles.invoiceTitle}>קבלה</Text>
            <Text style={styles.businessName}>{clientName}</Text>
            <View style={styles.divider} />
            <Text style={styles.invoiceNumber}>קבלה {invoiceNumber}</Text>
            <Text style={styles.invoiceLabel}>מילוי</Text>
          </View>

          <View style={styles.leftInfo}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>קולמן רבקה חנה</Text>
            <Text>עוסק פטור: 209643832</Text>
            <Text>הוחזה 16 מרכז שפירא</Text>
            <Text>טלפון: 972585052814+</Text>
          </View>
        </View>

        <View style={styles.clientName}>
          <Text>פרטי תשלומים</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol1}>אמצעי תשלום</Text>
            <Text style={styles.tableCol2}>פירוט</Text>
            <Text style={styles.tableCol3}>תאריך</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol1}>{formattedAmount}</Text>
            <Text style={styles.tableCol2}>{paymentMethod}</Text>
            <Text style={styles.tableCol3}>{treatmentDate}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>סה"כ</Text>
            <Text style={styles.totalAmount}>{formattedAmount}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>תודתה דיגיטלית מאובטחת</Text>
          <Text>נוצר באמצעות מערכת הנפקת קבלות | קבלה {invoiceNumber} | {date} 12:58 הנפק ב</Text>
          <Text>מוסף קוכזיות ח"מ את התשלום לא מקבילת 1 עמוד | נוצר</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
