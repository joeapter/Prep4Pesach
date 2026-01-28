import { Buffer } from 'node:buffer';
import { InvoiceDocument, InvoiceTemplateProps } from '@/lib/pdf/invoice-template';
import { pdf } from '@react-pdf/renderer';
import { supabaseService } from '@/lib/supabase/service';

export async function renderInvoiceToBuffer(props: InvoiceTemplateProps) {
  const blob = await pdf(<InvoiceDocument {...props} />).toBuffer();
  return blob;
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

  const { data: urlData, error: publicError } = supabaseService.storage.from(bucketName).getPublicUrl(filename);
  if (publicError) {
    throw publicError;
  }

  return urlData.publicUrl;
}

export type { InvoiceTemplateProps };
