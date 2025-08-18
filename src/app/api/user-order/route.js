import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    // console.log("Received email:", email); // Debug: Log email

    if (!email) {
    //   console.warn("Missing email:", email);
      return new NextResponse(JSON.stringify([]), { status: 200 });
    }

    // Query orders by billingDetails.email
    const orders = await Order.find({ "billingDetails.email": email, status: "success" }).lean();
    // console.log("Fetched orders:", orders); // Debug: Log orders
    return new NextResponse(JSON.stringify(orders || []), { status: 200 });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return new NextResponse(JSON.stringify([]), { status: 200 });
  }
}