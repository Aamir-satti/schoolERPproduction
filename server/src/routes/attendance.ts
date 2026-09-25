import { Router } from 'express';
import { Attendance } from '../models/Attendance';
import { Student } from '../models/Student';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const { classId, date, records } = req.body;
    if (!classId || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'classId, date, and records are required' });
    }

    const authHeader = req.headers.authorization;
    const jwt = await import('jsonwebtoken');
    const { env } = await import('../config/env');
    const token = authHeader?.split(' ')[1];
    const decoded = jwt.verify(token!, env.JWT_ACCESS_SECRET) as any;

    const results = [];
    for (const record of records) {
      const { studentId, status, remarks } = record;
      const existing = await Attendance.findOne({ studentId, date: new Date(date) });
      
      if (existing) {
        existing.status = status;
        existing.remarks = remarks;
        await existing.save();
        results.push(existing);
      } else {
        const attendance = await Attendance.create({
          studentId,
          classId,
          date: new Date(date),
          status,
          markedBy: decoded.userId,
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

router.get('/class/:classId/date/:date', requireAuth, async (req, res, next) => {
  try {
    const attendance = await Attendance.find({
      classId: req.params.classId,
      date: new Date(req.params.date),
    })
      .populate('studentId')
      .populate('markedBy', 'name');
    res.json({ success: true, message: 'Attendance retrieved', data: attendance });
  } catch (error) {
    next(error);
  }
});

router.get('/student/:studentId', requireAuth, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = { studentId: req.params.studentId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const attendance = await Attendance.find(query)
      .populate('classId', 'name code')
      .sort({ date: -1 });
    res.json({ success: true, message: 'Student attendance retrieved', data: attendance });
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
