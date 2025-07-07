import repFormat from '@/models/repmaster/repformat';
import RepRegion from '@/models/repmaster/repregion';
import connectDB from '@/lib/db'; // update path as needed

export async function GET() {
  try {
    await connectDB();

    const categories = await repFormat.find();

    const result = await Promise.all(
      categories.map(async (cat) => {
        const subcategories = await RepRegion.find({ repCountryId: cat._id });
        return {
          name: cat.repFormatName, // use correct field here
          subcategories: subcategories.map((sub) => sub.repRegionName),
        };
      })
    );

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error fetching categories', error: err.message }), { status: 500 });
  }
}
