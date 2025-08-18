import nodemailer from 'nodemailer';
import connectDB from '@/lib/db';   // your DB connection helper
import EmailTemplate from '@/models/EmailTemplate';

export async function POST(req) {
  try {
    await connectDB(); // ✅ ensure DB is connected

    const body = await req.json();
    const { topic, firstName, lastName, companyName, jobTitle, email, message } = body;

    // Fetch email template from DB
    const template = await EmailTemplate.findOne({ type: "contact_us" });
    if (!template) {
      return new Response(JSON.stringify({ error: 'Email template not found' }), { status: 404 });
    }

    // Replace placeholders in body
    // Replace placeholders in subject
    const compiledSubject = template.subject
      .replace(/{{firstName}}/g, firstName)
      .replace(/{{lastName}}/g, lastName)
      .replace(/{{companyName}}/g, companyName)
      .replace(/{{jobTitle}}/g, jobTitle)
      .replace(/{{email}}/g, email)
      .replace(/{{message}}/g, message)
      .replace(/{{topic}}/g, topic);

    // Replace placeholders in body
    const compiledBody = template.body
      .replace(/{{firstName}}/g, firstName)
      .replace(/{{lastName}}/g, lastName)
      .replace(/{{companyName}}/g, companyName)
      .replace(/{{jobTitle}}/g, jobTitle)
      .replace(/{{email}}/g, email)
      .replace(/{{message}}/g, message)
      .replace(/{{topic}}/g, topic);

    // Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS
      }
    });

    // Email to Admin
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission - ${topic}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><b>First Name:</b> ${firstName}</p>
        <p><b>Last Name:</b> ${lastName}</p>
        <p><b>Company Name:</b> ${companyName}</p>
        <p><b>Job Title:</b> ${jobTitle}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    // Email to User (from template)
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: compiledSubject,  // ✅ subject from DB
      html: compiledBody          // ✅ body from DB with placeholders replaced
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
}
