import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import readline from 'readline';
import { User } from '../src/models/User';
import { env } from '../src/config/env';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

async function createAdmin() {
  try {
    // Connect to database
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'ADMIN' });
    if (existingAdmin) {
      console.log('⚠️  An admin account already exists.');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log('   If you need to create another admin, delete the existing one first.');
      rl.close();
      await mongoose.disconnect();
      return;
    }

    // Get admin details
    console.log('\n📝 Create Admin Account\n');
    
    const name = await question('Name: ');
    const email = await question('Email: ');
    const password = await question('Password: ');

    if (!name || !email || !password) {
      console.log('❌ All fields are required.');
      rl.close();
      await mongoose.disconnect();
      return;
    }

    if (password.length < 8) {
      console.log('❌ Password must be at least 8 characters long.');
      rl.close();
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    });

    console.log('\n✅ Admin account created successfully!');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin._id}`);
    console.log('\nYou can now login at the application.');

    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    rl.close();
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();
