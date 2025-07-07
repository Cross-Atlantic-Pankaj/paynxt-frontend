import ProductCategory from '@/models/Catsec/ProductCategory';
import ProductSubCategory from '@/models/Catsec/ProductSubCategory';
import connectDB from '@/lib/db'; // update path as needed

export async function GET() {
  try {
    await connectDB();

    const categories = await ProductCategory.find();

    const result = await Promise.all(
      categories.map(async (cat) => {
        const subcategories = await ProductSubCategory.find({ productCategoryId: cat._id });
        return {
          name: cat.productCategoryName, // use correct field here
          subcategories: subcategories.map((sub) => sub.subProductName),
        };
      })
    );

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error fetching categories', error: err.message }), { status: 500 });
  }
}
