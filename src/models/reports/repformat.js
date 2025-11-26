import mongoose from 'mongoose';

const repFormatSchema = new mongoose.Schema(
  {
    repFormatName: { type: String, required: true },
  },
  { timestamps: true }
);

const repformats = mongoose.models.repformats || mongoose.model('repformats', repFormatSchema);

export default repformats;

