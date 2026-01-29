import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3H4i6g8u8WQz9Q.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcC7H4i6g8u8WQwEuQ.woff2', fontWeight: 600 }
  ]
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    padding: 36,
    backgroundColor: '#111827'
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingBottom: 12,
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    color: '#fbbf24',
    marginBottom: 4
  },
  section: {
    marginBottom: 12
  },
  lineHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 6,
    marginBottom: 6
  },
  lineRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#1f2937',
    paddingVertical: 6
  },
  lineItem: {
    flex: 3,
    fontSize: 10,
    color: '#e5e7eb'
  },
  lineMeta: {
    flex: 1,
    fontSize: 10,
    color: '#e5e7eb',
    textAlign: 'right'
  }
});

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
};

export type InvoiceTemplateProps = {
  invoiceNumber: string;
  clientName: string;
  clientAddress: string;
  jobAddress: string;
  createdAt: string;
  lines: InvoiceLineItem[];
  subtotal: number;
  total: number;
};

export function InvoiceDocument(props: InvoiceTemplateProps) {
  const { invoiceNumber, clientName, clientAddress, jobAddress, createdAt, lines, subtotal, total } = props;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Prep4Pesach Invoice</Text>
          <Text>Invoice #{invoiceNumber}</Text>
          <Text>{createdAt}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 12, color: '#fbbf24' }}>Bill to</Text>
          <Text>{clientName}</Text>
          <Text>{clientAddress}</Text>
          <Text style={{ fontSize: 10, color: '#94a3b8' }}>{jobAddress}</Text>
        </View>

        <View style={styles.lineHeader}>
          <Text style={styles.lineItem}>Description</Text>
          <Text style={styles.lineMeta}>Qty</Text>
          <Text style={styles.lineMeta}>Unit</Text>
          <Text style={styles.lineMeta}>Total</Text>
        </View>

        {lines.map((line) => (
          <View key={line.description} style={styles.lineRow}>
            <Text style={styles.lineItem}>{line.description}</Text>
            <Text style={styles.lineMeta}>{line.quantity}</Text>
            <Text style={styles.lineMeta}>{(line.unit_price_cents / 100).toFixed(2)}</Text>
            <Text style={styles.lineMeta}>{(line.line_total_cents / 100).toFixed(2)}</Text>
          </View>
        ))}

        <View style={{ marginTop: 20, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 12, color: '#94a3b8' }}>Subtotal: ₪{(subtotal / 100).toFixed(2)}</Text>
          <Text style={{ fontSize: 14, color: '#facc15' }}>Total: ₪{(total / 100).toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
}
