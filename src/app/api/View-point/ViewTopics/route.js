import ProductTopic from '@/models/Topic/ProductTopic';
import ProductSubTopic from '@/models/Topic/ProductSubTopic';
import connectDB from '@/lib/db'; // update path if needed

export async function GET() {
  try {
    await connectDB();

    const topics = await ProductTopic.find();

    const result = await Promise.all(
      topics.map(async (topic) => {
        const subtopics = await ProductSubTopic.find({ productTopicId: topic._id });
        return {
          name: topic.productTopicName, // adjust if your field is named differently
          subtopics: subtopics.map((sub) => sub.subProductName), // adjust if your subtopic name field is different
        };
      })
    );

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error fetching topics', error: err.message }), { status: 500 });
  }
}
