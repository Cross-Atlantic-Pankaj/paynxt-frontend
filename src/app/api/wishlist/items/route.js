import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Wishlist from '@/models/Wishlist';
import Repcontent from '@/models/reports/repcontent';
import TileTemplate from '@/models/TileTemplate';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    await connectDB();

    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Fetch wishlist for the user
    const wishlistItems = await Wishlist.find({ userId: decoded.userId }).lean();
    
    if (!wishlistItems || wishlistItems.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: [],
        message: 'No items in wishlist'
      });
    }

    // Extract seo_urls from wishlist
    const seoUrls = wishlistItems.map(item => item.seo_url);

    // Fetch reports that match the wishlist seo_urls
    const reports = await Repcontent.find({ 
      seo_url: { $in: seoUrls } 
    }).lean();

    if (!reports || reports.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: [],
        message: 'No matching reports found'
      });
    }

    // Extract unique tileTemplateIds (filter out null/undefined)
    const tileTemplateIds = [...new Set(
      reports
        .map(report => report.tileTemplateId)
        .filter(id => id && typeof id === 'string' && id.length === 24)
    )];

    // Fetch tile templates in batch if we have any IDs
    let tileTemplatesMap = new Map();
    if (tileTemplateIds.length > 0) {
      try {
        const tileTemplates = await TileTemplate.find({
          _id: { $in: tileTemplateIds }
        }).lean();
        
        tileTemplates.forEach(template => {
          tileTemplatesMap.set(template._id.toString(), template);
        });
      } catch (tileError) {
        console.warn('Failed to fetch tile templates:', tileError);
        // Continue without tile templates
      }
    }

    // Join the data manually and add wishlist metadata
    const enrichedReports = reports.map(report => {
      const wishlistItem = wishlistItems.find(item => item.seo_url === report.seo_url);
      return {
        ...report,
        tileTemplateId: report.tileTemplateId ? 
          tileTemplatesMap.get(report.tileTemplateId.toString()) || report.tileTemplateId : 
          null,
        addedToWishlistAt: wishlistItem?.addedAt || null
      };
    });

    // Sort by when added to wishlist (most recent first)
    enrichedReports.sort((a, b) => {
      if (!a.addedToWishlistAt || !b.addedToWishlistAt) return 0;
      return new Date(b.addedToWishlistAt) - new Date(a.addedToWishlistAt);
    });

    return NextResponse.json({ 
      success: true, 
      data: enrichedReports 
    }, {
      headers: {
        'Cache-Control': 'private, no-cache', // Private data, don't cache
      }
    });

  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
