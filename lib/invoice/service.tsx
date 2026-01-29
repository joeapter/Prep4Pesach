import { Buffer } from 'node:buffer';
import { InvoiceDocument, InvoiceTemplateProps } from '@/lib/pdf/invoice-template';
import { pdf } from '@react-pdf/renderer';
import { supabaseService } from '@/lib/supabase/service';

export async function renderInvoiceToBuffer(props: InvoiceTemplateProps) {
  const result = await pdf(<InvoiceDocument {...props} />).toBuffer();
  if (Buffer.isBuffer(result)) {
    return result;
  }

  if (result && typeof (result as any).getReader === 'function') {
    return streamToBuffer(result as unknown as ReadableStream<Uint8Array>);
  }

  throw new Error('Unable to convert PDF output to buffer.');
}

export async function uploadInvoicePdf(buffer: Buffer, filename: string) {
  const bucketName = 'invoices';
  const { data, error } = await supabaseService.storage
    .from(bucketName)
    .upload(filename, buffer, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = supabaseService.storage.from(bucketName).getPublicUrl(filename);
  if (!urlData?.publicUrl) {
    throw new Error('Unable to generate public URL for invoice PDF.');
  }

  return urlData.publicUrl;
}

export type { InvoiceTemplateProps };

async function streamToBuffer(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
    }
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}
