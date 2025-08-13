import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.json();

    const { topic, firstName, lastName, companyName, jobTitle, email, message } = body;

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

    // Email to User
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: 'Thank you for contacting us',
      html: `
        <p>Dear ${firstName},</p>
        <p>Thank you for reaching out to us. Our team will get back to you shortly.</p>
        <p>Best regards,<br/>Team</p>
      `
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
}
