import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import AssignedReport from '@/models/AssignedReport';
import Repcontent from '@/models/reports/repcontent';
import { Types } from 'mongoose';

export async function POST(req) {
  try {
    await connectDB();

    const { userId } = await req.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    // 1. Fetch purchased reports (from successful orders)
    const orders = await Order.find({ userId, status: 'success' });

    const purchasedTitles = new Set();
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.title) {
          purchasedTitles.add(item.title.trim());
        }
      });
    });

    // 2. Fetch assigned reports (from AssignedReport)
    const assigned = await AssignedReport.find({ userId }).lean();

    const assignedReportIds = assigned.map(a => a.reportId.toString());

    // 3. Fetch matching reports from Repcontent
    const allReports = await Repcontent.find({
      $or: [
        { report_title: { $in: [...purchasedTitles] } },
        { _id: { $in: assignedReportIds.map(id => new Types.ObjectId(id)) } }
      ]
    }).lean();

    return NextResponse.json({ success: true, data: allReports });
  } catch (err) {
    console.error('Error fetching user reports:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
