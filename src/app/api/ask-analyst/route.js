import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function POST(req) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Invalid token:', error);
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    // Parse FormData
    const formData = await req.formData();
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const query = formData.get('query');
    const file = formData.get('file');

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !query) {
      console.error('Missing required fields:', { firstName, lastName, email, subject, query });
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    // Validate file (optional, but required per your frontend)
    // if (!file) {
    //   console.error('No file uploaded');
    //   return NextResponse.json({ success: false, message: 'Please upload a document' }, { status: 400 });
    // }

    // Validate environment variables
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_EMAIL_PASS) {
      console.error('Missing environment variables:', {
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_EMAIL_PASS: !!process.env.ADMIN_EMAIL_PASS,
      });
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    // Save uploaded file temporarily
    let filePath = null;
    let fileName = null;

    if (file && typeof file.arrayBuffer === 'function') {
      const buffer = Buffer.from(await file.arrayBuffer());
      fileName = file.name || `upload-${Date.now()}.bin`;
      filePath = join(tmpdir(), fileName);
      await writeFile(filePath, buffer);
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    // Verify transporter connection
    await transporter.verify();

    // Prepare user confirmation email
    const userMail = {
      from: `"Paynxt360 Support" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: 'Query Received: Ask an Analyst',
      text: `Hi ${firstName},\n\nWe have received your query: "${subject}".\n\nOur team will get back to you shortly.\n\nBest,\nPaynxt360 Support Team`,
    };

    // Prepare admin notification email
    const adminMail = {
      from: `"Paynxt360 Support" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Analyst Query from ${firstName} ${lastName}`,
      text: `Subject: ${subject}\n\nQuery: ${query}\n\nFrom: ${firstName} ${lastName}\nEmail: ${email}\nUserID: ${decoded.userId}`,
      attachments: filePath
        ? [
          {
            filename: fileName,
            path: filePath,
          },
        ]
        : [],
    };

    // Send both emails
    await Promise.all([transporter.sendMail(userMail), transporter.sendMail(adminMail)]);

    // Clean up uploaded file
    if (filePath) {
      await unlink(filePath).catch(err => console.error('Error deleting file:', err));
    }

    return NextResponse.json({ success: true, message: 'Query submitted successfully' });
  } catch (error) {
    console.error('Error in /api/ask-analyst:', error);
    return NextResponse.json({ success: false, message: `Error: ${error.message}` }, { status: 500 });
  }
}