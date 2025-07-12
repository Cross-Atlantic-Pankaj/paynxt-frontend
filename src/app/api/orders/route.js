import paypal from '@paypal/checkout-server-sdk';
import { client } from '@/lib/paypal';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Save order
    const order = await Order.create({
      billingDetails: body.billingDetails,
      items: body.items,
      totalPrice: body.totalPrice,
      status: 'pending'
    });

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: body.totalPrice.toFixed(2)
        }
      }],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/paypal/success?orderId=${order._id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-cancel`
      }
    });

    const paypalClient = client();
    const paypalOrder = await paypalClient.execute(request);

    const approvalLink = paypalOrder.result.links.find(link => link.rel === 'approve')?.href;
    if (!approvalLink) {
      return NextResponse.json({ success: false, error: 'No approval link' }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId: order._id, paymentLink: approvalLink });
  } catch (err) {
    console.error('Error creating order or PayPal call failed:', err);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}
