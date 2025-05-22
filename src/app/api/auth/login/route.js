import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      console.log("Request payload is missing email or password");
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!user.password) {
      console.log(`Password not found for email: ${email}`);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log(`Invalid password for email: ${email}`);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        Firstname: user.Firstname,
        Lastname: user.Lastname,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}