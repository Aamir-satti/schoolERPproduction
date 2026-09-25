import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Teacher } from '../models/Teacher';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/teachers
router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { search, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const query: any = {};
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      const userIds = await User.find({ name: searchRegex }).select('_id');
      query.userId = { $in: userIds.map(u => u._id) };
    }

    const [teachers, total] = await Promise.all([
      Teacher.find(query)
        .populate('userId', 'name email phone')
        .populate('subjectIds', 'name code')
        .populate('classIds', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string)),
      Teacher.countDocuments(query),
    ]);

    res.json({
      success: true,
      message: 'Teachers retrieved',
      data: teachers,
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

// GET /api/teachers/:id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('userId', 'name email phone address')
      .populate('subjectIds', 'name code')
      .populate('classIds', 'name code');
    
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, message: 'Teacher retrieved', data: teacher });
  } catch (error) {
    next(error);
  }
});

// POST /api/teachers
router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const {
      email, password, name, phone, employeeId, designation,
      department, qualification, experience, joiningDate,
      subjectIds, classIds, isClassTeacher, assignedClassId, assignedSectionId,
    } = req.body;

    if (!email || !password || !name || !employeeId || !designation || !joiningDate) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const existingTeacher = await Teacher.findOne({ employeeId });
    if (existingTeacher) {
      return res.status(409).json({ success: false, message: 'Employee ID already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'TEACHER',
      name,
      phone,
    });

    const teacher = await Teacher.create({
      userId: user._id,
      employeeId,
      designation,
      department,
      qualification,
      experience,
      joiningDate,
      subjectIds: subjectIds || [],
      classIds: classIds || [],
      isClassTeacher: isClassTeacher || false,
      assignedClassId,
      assignedSectionId,
    });

    const populatedTeacher = await Teacher.findById(teacher._id)
      .populate('userId', 'name email phone')
      .populate('subjectIds', 'name code')
      .populate('classIds', 'name code');

    res.status(201).json({ success: true, message: 'Teacher created successfully', data: populatedTeacher });
  } catch (error) {
    next(error);
  }
});

// PUT /api/teachers/:id
router.put('/:id', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const { name, phone, designation, department, qualification, experience, subjectIds, classIds, isClassTeacher, assignedClassId, assignedSectionId, employmentStatus } = req.body;

    const updateData: any = {};
    if (designation !== undefined) updateData.designation = designation;
    if (department !== undefined) updateData.department = department;
    if (qualification !== undefined) updateData.qualification = qualification;
    if (experience !== undefined) updateData.experience = experience;
    if (subjectIds !== undefined) updateData.subjectIds = subjectIds;
    if (classIds !== undefined) updateData.classIds = classIds;
    if (isClassTeacher !== undefined) updateData.isClassTeacher = isClassTeacher;
    if (assignedClassId !== undefined) updateData.assignedClassId = assignedClassId;
    if (assignedSectionId !== undefined) updateData.assignedSectionId = assignedSectionId;
    if (employmentStatus !== undefined) updateData.employmentStatus = employmentStatus;

    if (name || phone) {
      const userUpdate: any = {};
      if (name) userUpdate.name = name;
      if (phone) userUpdate.phone = phone;
      await User.findByIdAndUpdate(teacher.userId, userUpdate);
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('userId', 'name email phone')
      .populate('subjectIds', 'name code')
      .populate('classIds', 'name code');

    res.json({ success: true, message: 'Teacher updated successfully', data: updatedTeacher });
  } catch (error) {
    next(error);
  }
});

export default router;
