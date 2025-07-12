import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import invoiceTemplate from '@/templates/invoiceTemplate';
import puppeteer from 'puppeteer';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    await connectDB();
    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 🧩 Launch puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // 🧩 Set HTML content
    const html = invoiceTemplate(order);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // 🧩 Create PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=Invoice_${order._id}.pdf`
      }
    });

  } catch (err) {
    console.error('Error generating invoice:', err);
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}
