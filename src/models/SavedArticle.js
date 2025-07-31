import mongoose from 'mongoose';

const SavedArticleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.SavedArticle || mongoose.model('SavedArticle', SavedArticleSchema);