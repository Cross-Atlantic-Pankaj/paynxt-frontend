import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import invoiceTemplate from '@/templates/invoiceTemplate';

const isProd = process.env.VERCEL === '1';

let puppeteer;
let chromium;

if (isProd) {
  puppeteer = (await import('puppeteer-core')).default;
  chromium = (await import('@sparticuz/chromium')).default;
} else {
  puppeteer = (await import('puppeteer')).default;
}

export async function GET(request, { params }) {
  const { id } = params;

  try {
    await connectDB();
    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let browser;

    if (isProd) {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
      });
    } else {
      browser = await puppeteer.launch({ headless: true });
    }

    const page = await browser.newPage();
    const html = invoiceTemplate(order);

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=Invoice_${order._id}.pdf`,
      },
    });
  } catch (err) {
    console.error('Error generating invoice:', err);
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}
