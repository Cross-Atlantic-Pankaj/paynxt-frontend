import { logoBase64 } from './logoBase64.js';

export default function invoiceTemplate(order) {
    return `
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 14px; color: #333; padding: 0; margin: 0; }
        .container { width: 800px; margin: auto; padding: 40px; }
        .header { background-color: #155392; color: white; padding: 20px; display: flex; align-items: center; justify-content: space-between; border-radius: 6px 6px 0 0; }
        .logo { height: 50px; }
        .title { font-size: 28px; font-weight: bold; }
        .details, .billing { margin-top: 20px; }
        .details p, .billing p { margin: 4px 0; }
        .section-title { font-size: 16px; font-weight: bold; margin-top: 30px; margin-bottom: 10px; color: #155392; }
        .items-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .items-table th { background-color: #f4f4f4; }
        .total { margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; color: #155392; }
        .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">

        <div class="header">
          <img src="data:image/svg+xml;base64,${logoBase64}" alt="Logo" class="logo" />
          <div class="title">Invoice</div>
        </div>

        <div class="details">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        </div>

        <div class="section-title">Billing Details</div>
        <div class="billing">
          <p><strong>${order.billingDetails.firstName} ${order.billingDetails.lastName}</strong></p>
          <p>Company: ${order.billingDetails.company || '-'}</p>
          <p>Email: ${order.billingDetails.email}</p>
          <p>${order.billingDetails.address1}${order.billingDetails.address2 ? ', ' + order.billingDetails.address2 : ''}</p>
          <p>${order.billingDetails.city}, ${order.billingDetails.state}</p>
          <p>${order.billingDetails.country} - ${order.billingDetails.zipcode}</p>
        </div>

        <div class="section-title">Order Items</div>
        <table class="items-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.title}</td>
                <td>$${item.price.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total">
          Total: $${order.totalPrice.toFixed(2)}
        </div>

        <div class="footer">
          Thank you for your purchase!<br/>
          Company Name • www.paynxt360.com • contact@paynxt360.com
        </div>
      </div>
    </body>
  </html>
  `;
}
