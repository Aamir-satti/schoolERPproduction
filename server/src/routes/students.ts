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

// GET /api/students/me - Get current student's profile
router.get('/me', requireAuth, requireRole(['STUDENT']), async (req: any, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.userId })
      .populate('userId', 'name email phone address')
      .populate('classId', 'name code sections');
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.json({ success: true, message: 'Student profile retrieved', data: student });
  } catch (error) {
    next(error);
  }
});

// GET /api/students/me/attendance - Get current student's attendance
router.get('/me/attendance', requireAuth, requireRole(['STUDENT']), async (req: any, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const { startDate, endDate } = req.query;
    const Attendance = (await import('../models/Attendance')).Attendance;
    const query: any = { studentId: student._id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const attendance = await Attendance.find(query)
      .populate('classId', 'name code')
      .sort({ date: -1 });

    // Calculate summary
    const totalDays = attendance.length;
    const present = attendance.filter((a: any) => a.status === 'PRESENT').length;
    const absent = attendance.filter((a: any) => a.status === 'ABSENT').length;
    const late = attendance.filter((a: any) => a.status === 'LATE').length;
    const leave = attendance.filter((a: any) => a.status === 'LEAVE').length;
    const percentage = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

    res.json({
      success: true,
      message: 'Student attendance retrieved',
      data: {
        records: attendance,
        summary: { totalDays, present, absent, late, leave, percentage },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/students/me/results - Get current student's published results
router.get('/me/results', requireAuth, requireRole(['STUDENT']), async (req: any, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const Exam = (await import('../models/Exam')).Exam;
    const Mark = (await import('../models/Mark')).Mark;

    const publishedExams = await Exam.find({
      isPublished: true,
      classIds: student.classId,
    }).populate('classIds', 'name code').sort({ startDate: -1 });

    const results = [];
    for (const exam of publishedExams) {
      const marks = await Mark.find({
        studentId: student._id,
        examId: exam._id,
      }).populate('subjectId', 'name code');

      if (marks.length > 0) {
        const totalObtained = marks.reduce((sum: number, m: any) => sum + m.obtainedMarks, 0);
        const totalMax = marks.reduce((sum: number, m: any) => sum + m.maxMarks, 0);
        const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
        const allPassed = marks.every((m: any) => m.isPassed);

        results.push({
          examId: exam,
          subjects: marks,
          totalObtained,
          totalMax,
          percentage,
          grade: percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F',
          resultStatus: allPassed ? 'PASS' : 'FAIL',
        });
      }
    }

    res.json({ success: true, message: 'Student results retrieved', data: results });
  } catch (error) {
    next(error);
  }
});

// GET /api/students/me/fees - Get current student's fee ledger
router.get('/me/fees', requireAuth, requireRole(['STUDENT']), async (req: any, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const FeePayment = (await import('../models/FeePayment')).FeePayment;
    const payments = await FeePayment.find({ studentId: student._id })
      .populate('feeStructureId', 'name')
      .sort({ month: -1 });

    const totalAmount = payments.reduce((sum: number, p: any) => sum + p.totalAmount, 0);
    const totalPaid = payments.reduce((sum: number, p: any) => sum + p.paidAmount, 0);
    const totalBalance = payments.reduce((sum: number, p: any) => sum + p.balanceAmount, 0);

    res.json({
      success: true,
      message: 'Student fee ledger retrieved',
      data: {
        payments,
        summary: { totalAmount, totalPaid, totalBalance },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/students/me/timetable - Get current student's class timetable
router.get('/me/timetable', requireAuth, requireRole(['STUDENT']), async (req: any, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const Timetable = (await import('../models/Timetable')).Timetable;
    const query: any = { classId: student.classId };
    if (student.sectionId) {
      query.$or = [{ sectionId: student.sectionId }, { sectionId: null }, { sectionId: '' }];
    }

    const timetable = await Timetable.find(query)
      .populate('subjectId', 'name code')
      .populate('teacherId')
      .sort({ dayOfWeek: 1, startTime: 1 });

    // Populate teacher name from User
    const populatedTimetable = [];
    for (const entry of timetable) {
      const entryObj = entry.toObject();
      if (entryObj.teacherId) {
        const teacher = await Teacher.findById(entryObj.teacherId).populate('userId', 'name');
        entryObj.teacherName = (teacher as any)?.userId?.name || 'N/A';
      }
      populatedTimetable.push(entryObj);
    }

    res.json({ success: true, message: 'Student timetable retrieved', data: populatedTimetable });
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
