import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  // Just redirect to cancel page on frontend
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/payment-cancel?orderId=${orderId}`);
}
