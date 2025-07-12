import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import { generateOTP, sendOTPEmail } from '@/lib/mail';

export async function POST(req) {
  try {
    const {
      Firstname,
      Lastname,
      email,
      password,
      jobTitle,
      companyName,
      phoneNumber,
      country,
      newsletter,
      termsAccepted
    } = await req.json();

    if (!Firstname || !Lastname || !email || !password || !termsAccepted) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const query = [{ email }];
    if (phoneNumber) {
      query.push({ phoneNumber });
    }
    const existingUser = await User.findOne({ $or: query });


    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone number already exists' },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 1);

    const hashedPassword = await bcrypt.hash(password, 10);

    await PendingUser.findOneAndDelete({ email });

    await PendingUser.create({
      Firstname,
      Lastname,
      email,
      password: hashedPassword,
      jobTitle,
      companyName,
      phoneNumber,
      country,
      newsletter,
      termsAccepted,
      otp,
      otpExpiry
    });

    await sendOTPEmail(email, otp);

    return NextResponse.json({
      message: 'OTP sent to your email for verification',
      email
    }, { status: 200 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}