import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { StockReview } from '../src/models/StockReview';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-google-reviews';

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all stock reviews without language field or with null/empty language
    const reviewsWithoutLanguage = await StockReview.find({
      $or: [
        { language: { $exists: false } },
        { language: null },
        { language: '' }
      ]
    });

    console.log(`Found ${reviewsWithoutLanguage.length} reviews without language field`);

    if (reviewsWithoutLanguage.length > 0) {
      // Update all to have language: 'English'
      const result = await StockReview.updateMany(
        {
          $or: [
            { language: { $exists: false } },
            { language: null },
            { language: '' }
          ]
        },
        { $set: { language: 'English' } }
      );

      console.log(`Updated ${result.modifiedCount} reviews to have language: 'English'`);
    } else {
      console.log('No reviews need migration');
    }

    // Verify migration
    const remaining = await StockReview.countDocuments({
      $or: [
        { language: { $exists: false } },
        { language: null },
        { language: '' }
      ]
    });

    console.log(`Remaining reviews without language: ${remaining}`);

    // Show stats per language
    const stats = await StockReview.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } }
    ]);

    console.log('\nLanguage distribution:');
    stats.forEach(s => console.log(`  ${s._id}: ${s.count}`));

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrate();