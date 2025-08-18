import connectDB from "@/lib/db";
import EmailTemplate from "@/models/EmailTemplate";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();
    const { reportId, reportTitle, userEmail, firstName } = await req.json();

    // 1. Fetch template
    const template = await EmailTemplate.findOne({ type: "sample_request" }).lean();
    if (!template) {
      return new Response(JSON.stringify({ success: false, message: "Template not found" }), { status: 404 });
    }

    // 2. Replace placeholders for User
    const subjectUser = template.subject
      .replace("{{firstName}}", firstName)
      .replace("{{reportTitle}}", reportTitle);

    const bodyUser = template.body
      .replace("{{firstName}}", firstName)
      .replace("{{reportTitle}}", reportTitle)
      .replace("{{reportId}}", reportId || "");

    // 3. Custom subject + body for Admin
    const subjectAdmin = `[Sample Request Received]`;
    const bodyAdmin = `
      <h2>New Sample Request Received</h2>
      <p><strong>User:</strong> ${firstName} (${userEmail})</p>
      <p><strong>Report ID:</strong> ${reportId}</p>
      <p><strong>Report Title:</strong> ${reportTitle}</p>
      <p>Please follow up with the user accordingly.</p>
    `;

    // 4. Configure transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 5. Send email to User
    await transporter.sendMail({
      from: `"Paynxt360" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: subjectUser,
      html: bodyUser,
    });

    // 6. Send email to Admin
    await transporter.sendMail({
      from: `"Paynxt360" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: subjectAdmin,
      html: bodyAdmin,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error sending sample request:", err);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
