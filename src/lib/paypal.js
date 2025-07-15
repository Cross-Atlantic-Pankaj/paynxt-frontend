// lib/paypal.js
import paypal from '@paypal/checkout-server-sdk';

export function environment() {
  return new paypal.core.LiveEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
}

export function client() {
  return new paypal.core.PayPalHttpClient(environment());
}
