import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  seo_url: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, { strict: true });

wishlistSchema.index({ userId: 1, seo_url: 1 }, { unique: true });

export default mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);