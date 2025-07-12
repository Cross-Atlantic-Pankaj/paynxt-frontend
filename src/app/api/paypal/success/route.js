import paypal from '@paypal/checkout-server-sdk';
import { client } from '@/lib/paypal';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import EmailTemplate from '@/models/EmailTemplate';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const paypalOrderId = searchParams.get('token');

    if (!orderId || !paypalOrderId) {
      return NextResponse.json({ success: false, error: 'Missing orderId or PayPal token' }, { status: 400 });
    }

    // Capture payment
    const paypalClient = client();
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});
    const capture = await paypalClient.execute(request);

    console.log('PayPal capture result:', capture);

    // Update local DB
    // const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: 'success' }, { new: true });
    console.log('Capturing PayPal order:', paypalOrderId);
    console.log('Updating orderId:', orderId);
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: 'success' }, { new: true });
    console.log('Updated order after DB update:', updatedOrder);
    console.log('Recipient email:', updatedOrder.billingDetails.email);

    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Send email with template
    try {
      const template = await EmailTemplate.findOne({ type: 'order_success' });
      if (template) {
        let body = template.body;
        body = body.replace('{{firstName}}', updatedOrder.billingDetails.firstName)
          .replace('{{totalPrice}}', updatedOrder.totalPrice);

        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });

        await transporter.sendMail({
          from: `"PayNxt" <${process.env.EMAIL_USER}>`,
          to: updatedOrder.billingDetails.email,
          subject: template.subject,
          html: body
        });
      } else {
        console.warn('Email template not found for type: order_success');
      }
    } catch (emailErr) {
      console.error('Failed to send email:', emailErr);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/payment-success?orderId=${orderId}`);
  } catch (err) {
    console.error('Payment success handler failed:', err);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}
