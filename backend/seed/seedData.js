/**
 * Database seeder — populates MongoDB with dummy election data.
 * Run: npm run seed (or: node seed/seedData.js)
 */

require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Candidate = require('../models/Candidate');
const Demographics = require('../models/Demographics');
const Sentiment = require('../models/Sentiment');
const { candidates, demographics, sentiments } = require('../data/dummyData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pow_predictor';

const seedDB = async () => {
  try {
    console.log('🌱 Seeding database...\n');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Candidate.deleteMany({});
    await Demographics.deleteMany({});
    await Sentiment.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert candidates
    const insertedCandidates = await Candidate.insertMany(
      candidates.map(({ _id, ...rest }) => rest)
    );
    console.log(`✅ Seeded ${insertedCandidates.length} candidates`);

    // Insert demographics
    const insertedDemographics = await Demographics.insertMany(
      demographics.map(({ _id, ...rest }) => rest)
    );
    console.log(`✅ Seeded ${insertedDemographics.length} demographics records`);

    // Insert sentiments with candidate references
    const sentimentData = sentiments.map((s, i) => ({
      candidate: insertedCandidates[i]?._id,
      candidate_id: String(i + 1),
      positive: s.positive,
      negative: s.negative,
      neutral: s.neutral
    }));
    const insertedSentiments = await Sentiment.insertMany(sentimentData);
    console.log(`✅ Seeded ${insertedSentiments.length} sentiment records`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSeeded data summary:');
    console.log(`   Candidates:   ${insertedCandidates.length}`);
    console.log(`   Demographics: ${insertedDemographics.length}`);
    console.log(`   Sentiments:   ${insertedSentiments.length}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

seedDB();
