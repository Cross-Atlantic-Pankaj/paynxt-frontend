import connectDB from '@/lib/db';
import NavbarSection from '@/models/NavbarSection';

export async function GET(req) {
  try {
    await connectDB();
    // Fetch all enabled sections & only enabled links
    const sections = await NavbarSection.find().lean();

    // Filter out disabled links
    const filteredSections = sections.map(section => ({
      ...section,
      links: section.links.filter(link => link.enabled)
    }));

    return Response.json({ success: true, data: filteredSections });
  } catch (error) {
    console.error('Error fetching navbar data:', error);
    return Response.json({ success: false, error: 'Failed to load navbar data' }, { status: 500 });
  }
}
