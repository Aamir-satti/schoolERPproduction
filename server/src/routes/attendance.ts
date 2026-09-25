import { Router } from 'express';
import { Attendance } from '../models/Attendance';
import { Student } from '../models/Student';
import { Teacher } from '../models/Teacher';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to normalize date to start of day (YYYY-MM-DD)
const normalizeDate = (dateStr: string): Date => {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
};

// POST /api/attendance - Mark attendance (Admin or Teacher)
router.post('/', requireAuth, requireRole(['ADMIN', 'TEACHER']), async (req: AuthRequest, res, next) => {
  try {
    const { classId, date, subjectId, records } = req.body;
    if (!classId || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'classId, date, and records are required' });
    }

    // Resolve teacher from authenticated user
    let teacherId = null;
    if (req.user!.role === 'TEACHER') {
      const teacher = await Teacher.findOne({ userId: req.user!.userId });
      if (!teacher) {
        return res.status(404).json({ success: false, message: 'Teacher profile not found' });
      }
      teacherId = teacher._id;

      // Verify teacher is assigned to this class
      if (!teacher.classIds.some((cid: any) => cid.toString() === classId)) {
        return res.status(403).json({ success: false, message: 'You are not authorized to mark attendance for this class' });
      }
    }

    const normalizedDate = normalizeDate(date);
    const results = [];

    for (const record of records) {
      const { studentId, status, remarks } = record;

      // Verify student belongs to the class
      const student = await Student.findOne({ _id: studentId, classId });
      if (!student) {
        continue; // Skip students not in this class
      }

      // Check for existing attendance (same student, date, subject)
      const existingQuery: any = {
        studentId,
        date: normalizedDate,
      };
      if (subjectId) {
        existingQuery.subjectId = subjectId;
      } else {
        existingQuery.subjectId = null;
      }

      const existing = await Attendance.findOne(existingQuery);
      
      if (existing) {
        existing.status = status;
        existing.remarks = remarks;
        await existing.save();
        results.push(existing);
      } else {
        const attendance = await Attendance.create({
          studentId,
          classId,
          date: normalizedDate,
          status,
          subjectId: subjectId || null,
          markedBy: teacherId || req.user!.userId,
          remarks,
        });
        results.push(attendance);
      }
    }

    res.json({ success: true, message: `Attendance marked for ${results.length} students`, data: results });
  } catch (error) {
    next(error);
  }
});

// GET /api/attendance/teacher/my-classes - Get classes teacher can mark attendance for
router.get('/teacher/my-classes', requireAuth, requireRole(['TEACHER']), async (req: any, res, next) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.userId }).populate('classIds', 'name code sections');
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }
    res.json({ success: true, message: 'Teacher classes retrieved', data: teacher.classIds });
  } catch (error) {
    next(error);
  }
});

// GET /api/attendance/class/:classId/students - Get students in a class for attendance marking
router.get('/class/:classId/students', requireAuth, requireRole(['ADMIN', 'TEACHER']), async (req: any, res, next) => {
  try {
    // If teacher, verify they teach this class
    if (req.user.role === 'TEACHER') {
      const teacher = await Teacher.findOne({ userId: req.user.userId });
      if (!teacher || !teacher.classIds.some((cid: any) => cid.toString() === req.params.classId)) {
        return res.status(403).json({ success: false, message: 'Not authorized for this class' });
      }
    }

    const students = await Student.find({ classId: req.params.classId, status: 'ACTIVE' })
      .populate('userId', 'name')
      .sort({ 'userId.name': 1 });
    res.json({ success: true, message: 'Students retrieved', data: students });
  } catch (error) {
    next(error);
  }
});

// GET /api/attendance/class/:classId/date/:date - Get class attendance for a date
router.get('/class/:classId/date/:date', requireAuth, async (req, res, next) => {
  try {
    const normalizedDate = normalizeDate(req.params.date);
    const attendance = await Attendance.find({
      classId: req.params.classId,
      date: normalizedDate,
    })
      .populate('studentId')
      .populate('markedBy');
    res.json({ success: true, message: 'Attendance retrieved', data: attendance });
  } catch (error) {
    next(error);
  }
});

// GET /api/attendance/student/:studentId - Get student attendance (Admin/Teacher only)
router.get('/student/:studentId', requireAuth, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = { studentId: req.params.studentId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = normalizeDate(startDate as string);
      if (endDate) query.date.$lte = normalizeDate(endDate as string);
    }

    const attendance = await Attendance.find(query)
      .populate('classId', 'name code')
      .sort({ date: -1 });
    res.json({ success: true, message: 'Student attendance retrieved', data: attendance });
  } catch (error) {
    next(error);
  }
});

// GET /api/attendance/me - Student's own attendance
router.get('/me', requireAuth, requireRole(['STUDENT']), async (req: any, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const { startDate, endDate } = req.query;
    const query: any = { studentId: student._id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = normalizeDate(startDate as string);
      if (endDate) query.date.$lte = normalizeDate(endDate as string);
    }

    const attendance = await Attendance.find(query)
      .populate('classId', 'name code')
      .sort({ date: -1 });

    const totalDays = attendance.length;
    const present = attendance.filter(a => a.status === 'PRESENT').length;
    const absent = attendance.filter(a => a.status === 'ABSENT').length;
    const late = attendance.filter(a => a.status === 'LATE').length;
    const leave = attendance.filter(a => a.status === 'LEAVE').length;
    const percentage = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

    res.json({
      success: true,
      message: 'My attendance retrieved',
      data: {
        records: attendance,
        summary: { totalDays, present, absent, late, leave, percentage },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/report/student/:studentId', requireAuth, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = { studentId: req.params.studentId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const attendance = await Attendance.find(query);
    const totalDays = attendance.length;
    const present = attendance.filter(a => a.status === 'PRESENT').length;
    const absent = attendance.filter(a => a.status === 'ABSENT').length;
    const late = attendance.filter(a => a.status === 'LATE').length;
    const leave = attendance.filter(a => a.status === 'LEAVE').length;
    const percentage = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

    res.json({
      success: true,
      message: 'Attendance report',
      data: { totalDays, present, absent, late, leave, percentage },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/report/class/:classId', requireAuth, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = { classId: req.params.classId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const attendance = await Attendance.find(query);
    const totalDays = attendance.length;
    const present = attendance.filter(a => a.status === 'PRESENT').length;
    const absent = attendance.filter(a => a.status === 'ABSENT').length;
    const late = attendance.filter(a => a.status === 'LATE').length;
    const leave = attendance.filter(a => a.status === 'LEAVE').length;
    const percentage = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

    res.json({
      success: true,
      message: 'Class attendance report',
      data: { totalDays, present, absent, late, leave, percentage },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
