import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, ...updateData } = body; // email is unique, use it to find the user

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to update profile" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },            // find by email
      { $set: updateData }, // update fields
      { new: true }         // return updated doc
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
