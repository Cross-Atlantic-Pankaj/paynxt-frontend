import repType from '@/models/repmaster/reptype';
import RepSubRegion from '@/models/repmaster/repsub';
import connectDB from '@/lib/db'; // update path as needed

export async function GET() {
  try {
    await connectDB();

    const categories = await repType.find();

    const result = await Promise.all(
      categories.map(async (cat) => {
        const subcategories = await RepSubRegion.find({ repSubCountryId: cat._id });
        return {
          name: cat.repTypeName, // use correct field here
          subcategories: subcategories.map((sub) => sub.repSubRegionName),
        };
      })
    );

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error fetching categories', error: err.message }), { status: 500 });
  }
}
