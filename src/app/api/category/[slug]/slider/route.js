import dbConnect from '@/lib/db';
import ProdSlider from '@/models/category/b2c-payment-intelligence/ProdSlider';

export async function GET(req, { params }) {
    // console.log('API called with params:', params);
    try {
        await dbConnect();

        const { slug } = params;

        if (!slug) {
            return new Response(JSON.stringify({ message: 'Slug is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // First try: find sliders for this slug
        let sliders = await ProdSlider.find({ slug })
            .sort({ createdAt: -1 })
            .limit(10);

        // If none found, fallback to global sliders (slug: null)
        if (!sliders || sliders.length === 0) {
            sliders = await ProdSlider.find({ slug: null })
                .sort({ createdAt: -1 })
                .limit(10);
        }

        return new Response(JSON.stringify(sliders || []), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching sliders:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch sliders' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
