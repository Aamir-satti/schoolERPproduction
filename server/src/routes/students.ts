import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Student } from '../models/Student';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/students
router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { search, classId, status, page = '1', limit = '20' } = req.query;
    const query: any = {};
    
    if (classId) query.classId = classId;
    if (status) query.status = status;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    let students = Student.find(query)
      .populate('userId', 'name email phone')
      .populate('classId', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      const userIds = await User.find({ name: searchRegex }).select('_id');
      query.$or = [
        { userId: { $in: userIds.map(u => u._id) } },
        { registrationNo: searchRegex },
        { fatherName: searchRegex },
      ];
    }

    const [studentsData, total] = await Promise.all([
      students,
      Student.countDocuments(query),
    ]);

    res.json({
      success: true,
      message: 'Students retrieved',
      data: studentsData,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/students/:id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email phone address')
      .populate('classId', 'name code sections');
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student retrieved', data: student });
  } catch (error) {
    next(error);
  }
});

// POST /api/students
router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const {
      email, password, name, phone, registrationNo, admissionNo,
      admissionDate, dateOfBirth, gender, bloodGroup, religion,
      fatherName, motherName, guardianPhone, guardianEmail,
      currentAddress, permanentAddress, classId, sectionId,
    } = req.body;

    // Validation
    if (!email || !password || !name || !registrationNo || !admissionNo || !admissionDate || !dateOfBirth || !gender || !fatherName || !guardianPhone || !classId) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // Check if registration number exists
    const existingStudent = await Student.findOne({ registrationNo });
    if (existingStudent) {
      return res.status(409).json({ success: false, message: 'Registration number already exists' });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'STUDENT',
      name,
      phone,
      address: currentAddress,
    });

    // Create student
    const student = await Student.create({
      userId: user._id,
      registrationNo,
      admissionNo,
      admissionDate,
      dateOfBirth,
      gender,
      bloodGroup,
      religion,
      fatherName,
      motherName,
      guardianPhone,
      guardianEmail,
      currentAddress,
      permanentAddress,
      classId,
      sectionId,
    });

    const populatedStudent = await Student.findById(student._id)
      .populate('userId', 'name email phone')
      .populate('classId', 'name code');

    res.status(201).json({ success: true, message: 'Student created successfully', data: populatedStudent });
  } catch (error) {
    next(error);
  }
});

// PUT /api/students/:id
router.put('/:id', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const { name, phone, fatherName, motherName, guardianPhone, guardianEmail, currentAddress, permanentAddress, classId, sectionId, bloodGroup, religion } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (fatherName !== undefined) updateData.fatherName = fatherName;
    if (motherName !== undefined) updateData.motherName = motherName;
    if (guardianPhone !== undefined) updateData.guardianPhone = guardianPhone;
    if (guardianEmail !== undefined) updateData.guardianEmail = guardianEmail;
    if (currentAddress !== undefined) updateData.currentAddress = currentAddress;
    if (permanentAddress !== undefined) updateData.permanentAddress = permanentAddress;
    if (classId !== undefined) updateData.classId = classId;
    if (sectionId !== undefined) updateData.sectionId = sectionId;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (religion !== undefined) updateData.religion = religion;

    // Update user info if name/phone changed
    if (name || phone) {
      const userUpdate: any = {};
      if (name) userUpdate.name = name;
      if (phone) userUpdate.phone = phone;
      await User.findByIdAndUpdate(student.userId, userUpdate);
    }

    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('userId', 'name email phone')
      .populate('classId', 'name code');

    res.json({ success: true, message: 'Student updated successfully', data: updatedStudent });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/students/:id/status
router.patch('/:id/status', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { status } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Also update user active status
    await User.findByIdAndUpdate(student.userId, { isActive: status === 'ACTIVE' });

    res.json({ success: true, message: 'Student status updated', data: student });
  } catch (error) {
    next(error);
  }
});

export default router;
