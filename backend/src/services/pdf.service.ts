import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';

interface InvoiceData {
  id: string;
  invoiceNumber?: string;
  amount: string | number;
  currency: string;
  status: string;
  dueDate: Date;
  createdAt: Date;
  metadata?: Record<string, unknown> | null;
}

interface CustomerData {
  name?: string | null;
  email: string;
  country?: string | null;
}

interface TenantData {
  name: string;
  email?: string;
  address?: string;
  country?: string;
  taxId?: string;
  logoUrl?: string;
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);
  private readonly storagePath: string;

  constructor(private readonly configService: ConfigService) {
    this.storagePath = this.configService.get<string>('PDF_STORAGE_PATH', './uploads/invoices');

    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  async generateInvoicePDF(
    invoice: InvoiceData,
    customer: CustomerData,
    tenant?: TenantData,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = 595.28;
      const marginLeft = 50;
      const marginRight = pageWidth - 50;
      const contentWidth = marginRight - marginLeft;
      const accentColor = '#6d28d9';
      const textDark = '#18181b';
      const textMuted = '#71717a';
      const borderColor = '#e4e4e7';
      const bgLight = '#fafafa';

      // --- Accent bar at top ---
      doc.rect(0, 0, pageWidth, 6).fill(accentColor);

      // --- Header section ---
      const headerY = 30;

      // Tenant info (left side — the issuer)
      const tenantName = tenant?.name || 'Invoice';
      doc
        .fontSize(20)
        .fillColor(textDark)
        .font('Helvetica-Bold')
        .text(tenantName, marginLeft, headerY, { width: contentWidth / 2 });

      let tenantY = doc.y + 4;
      doc.fontSize(9).fillColor(textMuted).font('Helvetica');
      if (tenant?.email) {
        doc.text(tenant.email, marginLeft, tenantY);
        tenantY = doc.y;
      }
      if (tenant?.address) {
        doc.text(tenant.address, marginLeft, tenantY);
        tenantY = doc.y;
      }
      if (tenant?.country) {
        doc.text(tenant.country, marginLeft, tenantY);
        tenantY = doc.y;
      }
      if (tenant?.taxId) {
        doc.text(`Tax ID: ${tenant.taxId}`, marginLeft, tenantY);
        tenantY = doc.y;
      }

      // INVOICE label (right side)
      doc
        .fontSize(32)
        .fillColor(accentColor)
        .font('Helvetica-Bold')
        .text('INVOICE', marginLeft, headerY, {
          width: contentWidth,
          align: 'right',
        });

      // Invoice details (right aligned below INVOICE)
      const detailsX = marginRight - 180;
      let detailY = headerY + 42;

      const invoiceNumber = invoice.invoiceNumber || `INV-${invoice.id.slice(-8).toUpperCase()}`;
      doc.fontSize(9).fillColor(textMuted).font('Helvetica');

      const detailRow = (label: string, value: string) => {
        doc.text(label, detailsX, detailY, { width: 80 });
        doc
          .font('Helvetica-Bold')
          .fillColor(textDark)
          .text(value, detailsX + 80, detailY, { width: 100, align: 'right' });
        doc.font('Helvetica').fillColor(textMuted);
        detailY += 16;
      };

      detailRow('Invoice No.', invoiceNumber);
      detailRow('Issue Date', this.formatDate(invoice.createdAt));
      detailRow('Due Date', this.formatDate(invoice.dueDate));
      detailRow('Status', invoice.status.toUpperCase());

      // --- Separator ---
      const separatorY = Math.max(tenantY, detailY) + 16;
      doc
        .moveTo(marginLeft, separatorY)
        .lineTo(marginRight, separatorY)
        .lineWidth(1)
        .strokeColor(borderColor)
        .stroke();

      // --- Bill To section ---
      const billToY = separatorY + 16;
      doc
        .fontSize(8)
        .fillColor(accentColor)
        .font('Helvetica-Bold')
        .text('BILL TO', marginLeft, billToY);

      let customerY = billToY + 14;
      doc
        .fontSize(12)
        .fillColor(textDark)
        .font('Helvetica-Bold')
        .text(customer.name || 'N/A', marginLeft, customerY);
      customerY = doc.y + 2;

      doc
        .fontSize(9)
        .fillColor(textMuted)
        .font('Helvetica')
        .text(customer.email, marginLeft, customerY);
      customerY = doc.y;
      if (customer.country) {
        doc.text(customer.country, marginLeft, customerY);
        customerY = doc.y;
      }

      // --- Line items table ---
      const tableTop = customerY + 24;

      // Table header background
      doc.rect(marginLeft, tableTop, contentWidth, 28).fill(bgLight);

      // Table header text
      doc.fontSize(8).fillColor(textMuted).font('Helvetica-Bold');
      doc.text('DESCRIPTION', marginLeft + 12, tableTop + 9, { width: 250 });
      doc.text('QTY', marginLeft + 280, tableTop + 9, { width: 50, align: 'center' });
      doc.text('UNIT PRICE', marginLeft + 340, tableTop + 9, { width: 80, align: 'right' });
      doc.text('AMOUNT', marginLeft + 430, tableTop + 9, { width: 65, align: 'right' });

      // Table rows
      let rowY = tableTop + 28;
      const items = (invoice.metadata as Record<string, unknown>)?.items;

      doc.font('Helvetica').fillColor(textDark).fontSize(9);

      if (Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const lineItem = item as Record<string, unknown>;
          const desc = String(lineItem.description || 'Item');
          const qty = Number(lineItem.quantity || 1);
          const unit = Number(lineItem.unitAmount || lineItem.unitPrice || 0);
          const lineTotal = qty * unit;

          // Row border
          doc
            .moveTo(marginLeft, rowY)
            .lineTo(marginRight, rowY)
            .lineWidth(0.5)
            .strokeColor(borderColor)
            .stroke();

          doc.fillColor(textDark).text(desc, marginLeft + 12, rowY + 10, { width: 250 });
          doc
            .fillColor(textMuted)
            .text(String(qty), marginLeft + 280, rowY + 10, { width: 50, align: 'center' });
          doc
            .fillColor(textMuted)
            .text(this.formatMoney(unit, invoice.currency), marginLeft + 340, rowY + 10, {
              width: 80,
              align: 'right',
            });
          doc
            .fillColor(textDark)
            .text(this.formatMoney(lineTotal, invoice.currency), marginLeft + 430, rowY + 10, {
              width: 65,
              align: 'right',
            });

          rowY += 32;
        }
      } else {
        // Single subscription line
        doc
          .moveTo(marginLeft, rowY)
          .lineTo(marginRight, rowY)
          .lineWidth(0.5)
          .strokeColor(borderColor)
          .stroke();

        const planName = (invoice.metadata as Record<string, unknown>)?.planName;
        const interval = (invoice.metadata as Record<string, unknown>)?.billingInterval;
        const desc = planName
          ? `${planName} subscription${interval ? ` (${String(interval).toLowerCase()})` : ''}`
          : 'Subscription billing';

        doc.fillColor(textDark).text(desc, marginLeft + 12, rowY + 10, { width: 250 });
        doc
          .fillColor(textMuted)
          .text('1', marginLeft + 280, rowY + 10, { width: 50, align: 'center' });
        doc
          .fillColor(textMuted)
          .text(
            this.formatMoney(Number(invoice.amount), invoice.currency),
            marginLeft + 340,
            rowY + 10,
            { width: 80, align: 'right' },
          );
        doc
          .fillColor(textDark)
          .text(
            this.formatMoney(Number(invoice.amount), invoice.currency),
            marginLeft + 430,
            rowY + 10,
            { width: 65, align: 'right' },
          );

        rowY += 32;
      }

      // Bottom border of table
      doc
        .moveTo(marginLeft, rowY)
        .lineTo(marginRight, rowY)
        .lineWidth(0.5)
        .strokeColor(borderColor)
        .stroke();

      // --- Totals section ---
      const totalsX = marginLeft + 340;
      const totalsWidth = contentWidth - 340 + 12;
      let totalsY = rowY + 16;

      const totalAmount = Number(invoice.amount);

      // Subtotal
      doc.fontSize(9).fillColor(textMuted).font('Helvetica').text('Subtotal', totalsX, totalsY);
      doc
        .fillColor(textDark)
        .text(this.formatMoney(totalAmount, invoice.currency), totalsX, totalsY, {
          width: totalsWidth,
          align: 'right',
        });
      totalsY += 20;

      // Tax
      const taxAmount = Number((invoice.metadata as any)?.taxAmount) || 0;
      doc.fillColor(textMuted).text('Tax', totalsX, totalsY);
      doc.text(this.formatMoney(taxAmount, invoice.currency), totalsX, totalsY, {
        width: totalsWidth,
        align: 'right',
      });
      totalsY += 20;

      // Separator before total
      doc
        .moveTo(totalsX, totalsY)
        .lineTo(marginRight, totalsY)
        .lineWidth(1)
        .strokeColor(borderColor)
        .stroke();
      totalsY += 10;

      // Total
      doc
        .fontSize(14)
        .fillColor(textDark)
        .font('Helvetica-Bold')
        .text('Total Due', totalsX, totalsY);
      doc.text(
        this.formatMoney(totalAmount, invoice.currency),
        totalsX,
        totalsY,
        { width: totalsWidth, align: 'right' },
      );

      // --- Status badge ---
      totalsY += 32;
      const statusColors: Record<string, string> = {
        PENDING: '#f59e0b',
        PAID: '#22c55e',
        FAILED: '#ef4444',
        CANCELED: '#71717a',
      };
      const statusColor = statusColors[invoice.status.toUpperCase()] || '#71717a';
      const statusText = invoice.status.toUpperCase();
      const statusBadgeWidth = doc.widthOfString(statusText) + 24;

      doc
        .roundedRect(marginRight - statusBadgeWidth, totalsY, statusBadgeWidth, 22, 4)
        .fill(statusColor);
      doc
        .fontSize(9)
        .fillColor('#ffffff')
        .font('Helvetica-Bold')
        .text(statusText, marginRight - statusBadgeWidth, totalsY + 6, {
          width: statusBadgeWidth,
          align: 'center',
        });

      // --- Footer ---
      const footerY = 760;
      doc
        .moveTo(marginLeft, footerY)
        .lineTo(marginRight, footerY)
        .lineWidth(0.5)
        .strokeColor(borderColor)
        .stroke();

      doc
        .fontSize(8)
        .fillColor(textMuted)
        .font('Helvetica')
        .text('Thank you for your business.', marginLeft, footerY + 10, {
          width: contentWidth,
          align: 'center',
        });

      doc.text(
        tenant?.name ? `${tenant.name} — Powered by NovaBilling` : 'Generated by NovaBilling',
        marginLeft,
        footerY + 22,
        {
          width: contentWidth,
          align: 'center',
        },
      );

      doc.end();
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  private static readonly ZERO_DECIMAL_CURRENCIES = new Set([
    'JPY', 'KRW', 'UGX', 'RWF', 'XOF', 'XAF', 'TZS',
    'VND', 'CLP', 'GNF', 'BIF', 'DJF', 'KMF', 'PYG',
  ]);

  private formatMoney(amount: number, currency: string): string {
    const decimals = PdfService.ZERO_DECIMAL_CURRENCIES.has(currency?.toUpperCase()) ? 0 : 2;
    return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  }

  /** Format an amount as a string for use in emails and other contexts */
  static formatAmount(amount: number | string | { toString(): string }, currency: string): string {
    const num = Number(amount);
    const decimals = PdfService.ZERO_DECIMAL_CURRENCIES.has(currency?.toUpperCase()) ? 0 : 2;
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  async savePdf(buffer: Buffer, filename: string): Promise<string> {
    const filePath = path.join(this.storagePath, filename);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  getPublicUrl(filename: string): string {
    return `/uploads/invoices/${filename}`;
  }

  /**
   * Returns the full API URL for downloading an invoice PDF via the API endpoint.
   * Used in emails where relative URLs don't work.
   */
  getInvoiceApiUrl(invoiceId: string): string {
    const baseUrl = this.configService.get<string>('API_BASE_URL', 'http://localhost:4000');
    return `${baseUrl}/api/invoices/${invoiceId}/pdf`;
  }
}
