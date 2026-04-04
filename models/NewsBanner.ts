import mongoose from 'mongoose'

const NewsBannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  status: {
    type: String,
    enum: ['Active', 'Scheduled', 'Expired'],
    required: true
  },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, {
  collection: 'news_banners' // Explicitly set collection name
})

// Add timestamps for proper date handling
NewsBannerSchema.pre('save', function(next) {
  this.updatedAt = new Date().toISOString()
  if (!this.createdAt) {
    this.createdAt = new Date().toISOString()
  }
  next()
})

export const NewsBanner = mongoose.models.NewsBanner || mongoose.model('NewsBanner', NewsBannerSchema)