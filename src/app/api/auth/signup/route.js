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

    // Check if user exists with BOTH email AND phoneNumber (both must match)
    // Only consider a user as existing if both email and phoneNumber match
    const query = { email };
    if (phoneNumber) {
      query.phoneNumber = phoneNumber;
    }
    const existingUser = await User.findOne(query);


    if (existingUser) {
      return NextResponse.json(
        {
          error:
            'User already exists. If you have forgotten the password, please reset the password by clicking on "Forgot Password" link.'
        },
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