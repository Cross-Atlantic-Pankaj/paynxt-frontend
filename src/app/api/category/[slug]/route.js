import connectDB from '@/lib/db';
import NavbarSection from '@/models/NavbarSection';
import Repcontent from '@/models/reports/repcontent';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 10; // Adjust page size as needed

    // Find the navbar link with the matching URL
    const url = `/category/${slug}`;
    const navbarSection = await NavbarSection.findOne(
      { 'links.url': url },
      { 'links.$': 1 }
    ).populate('links.category');

    if (!navbarSection || !navbarSection.links[0]?.category) {
      return NextResponse.json(
        { success: false, message: 'No category found for this URL' },
        { status: 404 }
      );
    }

    const categoryName = navbarSection.links[0].category.productCategoryName;

    // Fetch featured reports matching the category with pagination
    const reports = await Repcontent.find({
      Product_category: categoryName,
      report_visible: { $in: [1, 2, 3] },
      Featured_Report_Status: 1, // Only featured reports
    })
      .sort({ report_publish_date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Repcontent.countDocuments({
      Product_category: categoryName,
      report_visible: { $in: [1, 2, 3] },
      Featured_Report_Status: 1,
    });

    return NextResponse.json({
      success: true,
      data: reports,
      pagination: {
        page,
        limit,
        total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching featured reports by category slug:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
