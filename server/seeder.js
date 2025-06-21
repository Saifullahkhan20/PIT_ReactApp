console.log('Seeder script started...');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const User = require('./models/User');
const db = require('./config/db');
const path = require('path');
const slugify = require('slugify');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('MONGO_URI:', process.env.MONGO_URI);

db();

async function seed() {
  try {
    console.log('Clearing existing data and dropping indexes...');
    // Drop all indexes before deleting documents to prevent issues with unique indexes on partially defined fields
    // await Brand.collection.dropIndexes().catch(err => console.warn('Error dropping Brand indexes (might not exist):', err.message));
    // await Category.collection.dropIndexes().catch(err => console.warn('Error dropping Category indexes (might not exist):', err.message));
    
    // Clear existing data (Commented out to prevent accidental data deletion)
    // await Product.deleteMany();
    // await Category.deleteMany();
    // await Brand.deleteMany();
    // await User.deleteMany();

    console.log('All existing data cleared and indexes potentially dropped.');

    // Create a dummy user for product/category ownership
    let dummyUser = await User.findOne({ email: 'seeder@example.com' });

    if (!dummyUser) {
      dummyUser = await User.create({
        name: 'Seeder User',
        email: 'seeder@example.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Dummy user created.');
    } else {
      console.log('Dummy user already exists, using existing user.');
    }

    // Create categories
    let phoneCategory = await Category.findOne({ name: 'Phone' });
    if (!phoneCategory) {
      phoneCategory = await Category.create({
        name: 'Phone',
        slug: slugify('Phone', { lower: true }),
        user: dummyUser._id,
        description: 'Smartphones and mobile devices.'
      });
      console.log('Phone category created.');
    } else {
      console.log('Phone category already exists, using existing category.');
    }

    let laptopCategory = await Category.findOne({ name: 'Laptop' });
    if (!laptopCategory) {
      laptopCategory = await Category.create({
        name: 'Laptop',
        slug: slugify('Laptop', { lower: true }),
        user: dummyUser._id,
        description: 'Portable computers for work and play.'
      });
      console.log('Laptop category created.');
    } else {
      console.log('Laptop category already exists, using existing category.');
    }

    // Create brands
    let apple = await Brand.findOne({ name: 'Apple' });
    if (!apple) {
      apple = await Brand.create({ name: 'Apple', slug: slugify('Apple', { lower: true }), user: dummyUser._id, description: 'Renowned for premium electronics.' });
      console.log('Apple brand created.');
    } else {
      console.log('Apple brand already exists, using existing brand.');
    }

    let samsung = await Brand.findOne({ name: 'Samsung' });
    if (!samsung) {
      samsung = await Brand.create({ name: 'Samsung', slug: slugify('Samsung', { lower: true }), user: dummyUser._id, description: 'Global leader in technology.' });
      console.log('Samsung brand created.');
    } else {
      console.log('Samsung brand already exists, using existing brand.');
    }

    let google = await Brand.findOne({ name: 'Google' });
    if (!google) {
      google = await Brand.create({ name: 'Google', slug: slugify('Google', { lower: true }), user: dummyUser._id, description: 'Innovator in software and hardware.' });
      console.log('Google brand created.');
    } else {
      console.log('Google brand already exists, using existing brand.');
    }

    let dell = await Brand.findOne({ name: 'Dell' });
    if (!dell) {
      dell = await Brand.create({ name: 'Dell', slug: slugify('Dell', { lower: true }), user: dummyUser._id, description: 'Provider of high-performance computers.' });
      console.log('Dell brand created.');
    } else {
      console.log('Dell brand already exists, using existing brand.');
    }

    // Create/Update products with unique slugs and specs
    console.log('Attempting to insert/update products...');
    for (const productData of products) {
      await Product.findOneAndUpdate(
        { slug: productData.slug }, // Find by unique slug
        {
          $set: {
            name: productData.name,
            price: productData.price,
            description: productData.description,
            image: productData.mainImage,
            category: productData.category,
            brand: productData.brand,
            user: productData.user,
            stock: productData.stock,
            specs: productData.specs // Ensure specs are set/updated
          }
        },
        {
          upsert: true, // Create if not found
          new: true,   // Return the updated/new document
          runValidators: true // Run schema validators
        }
      );
    }
    console.log('All products inserted/updated successfully!');

    console.log('Data seeded successfully.');
  } catch (err) {
    console.error(`Error seeding data: ${err.message}`);
    process.exit(1);
  } finally {
    console.log('Closing DB connection...');
    mongoose.connection.close();
    console.log('DB connection closed.');
  }
}

seed();