import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../src/models/User';
import { Class } from '../src/models/Class';
import { Subject } from '../src/models/Subject';
import { Teacher } from '../src/models/Teacher';
import { Student } from '../src/models/Student';
import { Notification } from '../src/models/Notification';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management';

async function seed() {
  try {
    console.log('🌱 Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@school.gs' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Skipping seed.');
      await mongoose.disconnect();
      return;
    }

    console.log('📝 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@school.gs',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    });
    console.log('✅ Admin user created');
    console.log(`   Email: admin@school.gs`);
    console.log(`   Password: admin123`);

    // Create sample classes
    console.log('📚 Creating sample classes...');
    const class9 = await Class.create({
      name: 'Class 9',
      code: 'CLS09',
      sections: [{ name: 'A' }, { name: 'B' }],
      isActive: true,
    });

    const class10 = await Class.create({
      name: 'Class 10',
      code: 'CLS10',
      sections: [{ name: 'A' }, { name: 'B' }],
      isActive: true,
    });
    console.log('✅ Classes created');

    // Create sample subjects
    console.log('📖 Creating sample subjects...');
    const math = await Subject.create({
      name: 'Mathematics',
      code: 'MAT101',
      classIds: [class9._id, class10._id],
      isActive: true,
    });

    const english = await Subject.create({
      name: 'English',
      code: 'ENG101',
      classIds: [class9._id, class10._id],
      isActive: true,
    });

    const science = await Subject.create({
      name: 'Science',
      code: 'SCI101',
      classIds: [class9._id, class10._id],
      isActive: true,
    });
    console.log('✅ Subjects created');

    // Create sample teacher
    console.log('👨‍🏫 Creating sample teacher...');
    const teacherPassword = await bcrypt.hash('teacher123', 12);
    const teacherUser = await User.create({
      name: 'John Smith',
      email: 'teacher@school.gs',
      password: teacherPassword,
      role: 'TEACHER',
      isActive: true,
    });

    const teacher = await Teacher.create({
      userId: teacherUser._id,
      employeeId: 'T001',
      designation: 'Senior Teacher',
      department: 'Academic',
      joiningDate: new Date('2023-01-15'),
      subjectIds: [math._id, science._id],
      classIds: [class9._id, class10._id],
      employmentStatus: 'ACTIVE',
    });

    // Update subjects with teacher
    await Subject.updateMany(
      { _id: { $in: [math._id, science._id] } },
      { $push: { teacherIds: teacher._id } }
    );
    console.log('✅ Teacher created');
    console.log(`   Email: teacher@school.gs`);
    console.log(`   Password: teacher123`);

    // Create sample student
    console.log('👨‍🎓 Creating sample student...');
    const studentPassword = await bcrypt.hash('student123', 12);
    const studentUser = await User.create({
      name: 'Alice Johnson',
      email: 'student@school.gs',
      password: studentPassword,
      role: 'STUDENT',
      isActive: true,
    });

    const student = await Student.create({
      userId: studentUser._id,
      registrationNo: 'STU2024001',
      admissionNo: 'ADM2024001',
      admissionDate: new Date('2024-04-01'),
      dateOfBirth: new Date('2009-05-15'),
      gender: 'FEMALE',
      fatherName: 'Robert Johnson',
      guardianPhone: '+1234567890',
      classId: class10._id,
      sectionId: class10.sections[0]._id.toString(),
      status: 'ACTIVE',
    });
    console.log('✅ Student created');
    console.log(`   Email: student@school.gs`);
    console.log(`   Password: student123`);

    // Create welcome notification
    console.log('🔔 Creating welcome notification...');
    await Notification.create({
      title: 'Welcome to School ERP',
      message: 'The School ERP system has been successfully initialized with sample data.',
      type: 'GENERAL',
      isPublic: true,
      targetRoles: ['ALL'],
      publicationDate: new Date(),
      createdBy: admin._id,
      isActive: true,
    });
    console.log('✅ Notification created');

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('   Admin:   admin@school.gs / admin123');
    console.log('   Teacher: teacher@school.gs / teacher123');
    console.log('   Student: student@school.gs / student123');

    await mongoose.disconnect();
    console.log('✅ Disconnected from database');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
