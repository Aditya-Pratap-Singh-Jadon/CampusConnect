const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Application = require('../models/Application');
const Connection = require('../models/connection');
const configureMongoDns = require('../config/mongoDns');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../seed-data/campusconnect-seed.json'), 'utf8'));
const groups = [
  ['users', User],
  ['posts', Post],
  ['applications', Application],
  ['connections', Connection],
];

async function checkData() {
  const ids = new Set();
  for (const [name, Model] of groups) {
    if (!Array.isArray(data[name])) throw new Error(`${name} must be an array`);
    for (const record of data[name]) {
      if (ids.has(record._id)) throw new Error(`Duplicate seed _id: ${record._id}`);
      ids.add(record._id);
      try {
        await new Model(record).validate();
      } catch (error) {
        throw new Error(`${name} ${record._id}: ${error.message}`);
      }
    }
  }
  const has = (name, id) => data[name].some((record) => record._id === id);
  for (const post of data.posts) if (!has('users', post.creator)) throw new Error(`Unknown post creator: ${post.creator}`);
  for (const item of data.applications) {
    if (!has('posts', item.post) || !has('users', item.applicant)) throw new Error(`Broken application reference: ${item._id}`);
  }
  for (const item of data.connections) {
    if (!has('users', item.sender) || !has('users', item.receiver)) throw new Error(`Broken connection reference: ${item._id}`);
  }
}

async function applySeed() {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes('REPLACE_ME')) throw new Error('Set MONGO_URI in Backend/.env before seeding.');
  const database = uri.match(/^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/)?.[1];
  if (database !== 'campusconnect') throw new Error('Seed target must be the campusconnect database.');
  try {
    configureMongoDns();
    await mongoose.connect(uri);
    for (const [name, Model] of groups) {
      for (const record of data[name]) {
        const existing = await Model.findById(record._id).lean();
        const identity = name === 'users' ? 'email' : name === 'posts' ? 'title' : null;
        if (existing && identity && existing[identity] !== record[identity]) {
          throw new Error(`Seed _id conflicts with an existing ${name} record: ${record._id}`);
        }
        await Model.replaceOne({ _id: record._id }, record, { upsert: true, runValidators: true });
      }
      console.log(`${name}: ${data[name].length} demo records upserted`);
    }
  } finally {
    await mongoose.disconnect();
  }
}

async function main() {
  await checkData();
  if (process.argv.includes('--apply')) {
    await applySeed();
  } else {
    console.log('Seed data is valid. No database connection or write was attempted. Use --apply after approval.');
  }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
