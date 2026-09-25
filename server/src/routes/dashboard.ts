import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Student } from '../models/Student';
import { Teacher } from '../models/Teacher';
import { Class } from '../models/Class';
import { Attendance } from '../models/Attendance';
import { FeePayment } from '../models/FeePayment';
import { SalaryRecord } from '../models/SalaryRecord';
import { Notification } from '../models/Notification';
import { Timetable } from '../models/Timetable';
import { Exam } from '../models/Exam';
import { Mark } from '../models/Mark';
import { env } from '../config/env';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Admin Dashboard
router.get('/admin', requireAuth, requireRole(['ADMIN']), async (_req, res, next) => {
  try {
    const [studentCount, teacherCount, classCount, todayAttendance, feePayments, salaryRecords, notifications] = await Promise.all([
      Student.countDocuments({ status: 'ACTIVE' }),
      Teacher.countDocuments({ employmentStatus: 'ACTIVE' }),
      Class.countDocuments({ isActive: true }),
      Attendance.find({ date: new Date().toISOString().split('T')[0] }),
      FeePayment.find(),
      SalaryRecord.find(),
      Notification.find({ isActive: true }).sort({ publicationDate: -1 }).limit(5),
    ]);

    const presentToday = todayAttendance.filter(a => a.status === 'PRESENT').length;
    const absentToday = todayAttendance.filter(a => a.status === 'ABSENT').length;

    const totalDue = feePayments.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalCollected = feePayments.reduce((sum, p) => sum + p.paidAmount, 0);
    const outstanding = totalDue - totalCollected;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthCollection = feePayments
      .filter(p => p.month === currentMonth)
      .reduce((sum, p) => sum + p.paidAmount, 0);

    const salaryTotalDue = salaryRecords.reduce((sum, r) => sum + r.netSalary, 0);
    const salaryTotalPaid = salaryRecords.reduce((sum, r) => sum + r.paidAmount, 0);
    const unpaidSalaryCount = salaryRecords.filter(r => r.status === 'UNPAID').length;

    res.json({
      success: true,
      message: 'Admin dashboard data',
      data: {
        studentCount,
        teacherCount,
        classCount,
        attendanceSummary: {
          presentToday,
          absentToday,
          totalStudents: studentCount,
        },
        feeSummary: {
          totalDue,
          totalCollected,
          outstanding,
          currentMonthCollection,
        },
        salarySummary: {
          totalDue: salaryTotalDue,
          totalPaid: salaryTotalPaid,
          unpaidCount: unpaidSalaryCount,
        },
        recentNotifications: notifications,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Teacher Dashboard
router.get('/teacher', requireAuth, requireRole(['TEACHER']), async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const decoded = jwt.verify(token!, env.JWT_ACCESS_SECRET) as { userId: string };

    const teacher = await Teacher.findOne({ userId: decoded.userId })
      .populate('classIds', 'name code')
      .populate('subjectIds', 'name code');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const today = days[new Date().getDay()];

    const todayTimetable = await Timetable.find({
      teacherId: teacher._id,
      dayOfWeek: today,
    })
      .populate('classId', 'name code')
      .populate('subjectId', 'name code')
      .sort({ startTime: 1 });

    const upcomingExams = await Exam.find({
      classIds: { $in: teacher.classIds.map((c: any) => c._id) },
      startDate: { $gte: new Date() },
      status: { $in: ['SCHEDULED', 'IN_PROGRESS'] },
    }).sort({ startDate: 1 }).limit(5);

    res.json({
      success: true,
      message: 'Teacher dashboard data',
      data: {
        assignedClasses: teacher.classIds,
        todayTimetable,
        attendanceTasks: [],
        upcomingExams,
        marksEntryTasks: [],
      },
    });
  } catch (error) {
    next(error);
  }
});

// Student Dashboard
router.get('/student', requireAuth, requireRole(['STUDENT']), async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const decoded = jwt.verify(token!, env.JWT_ACCESS_SECRET) as { userId: string };

    const student = await Student.findOne({ userId: decoded.userId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const today = days[new Date().getDay()];

    const timetable = await Timetable.find({
      classId: student.classId,
      dayOfWeek: today,
    })
      .populate('subjectId', 'name code')
      .populate('teacherId', 'name')
      .sort({ startTime: 1 });

    const attendance = await Attendance.find({ studentId: student._id });
    const totalDays = attendance.length;
    const present = attendance.filter(a => a.status === 'PRESENT').length;
    const attendancePercentage = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

    const exams = await Exam.find({
      classIds: student.classId,
      isPublished: true,
    }).sort({ startDate: -1 }).limit(5);

    const recentResults = [];
    for (const exam of exams) {
      const marks = await Mark.find({ studentId: student._id, examId: exam._id }).populate('subjectId', 'name code');
      if (marks.length > 0) {
        const totalObtained = marks.reduce((sum, m) => sum + m.obtainedMarks, 0);
        const totalMax = marks.reduce((sum, m) => sum + m.maxMarks, 0);
        const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
        const allPassed = marks.every(m => m.isPassed);
        recentResults.push({
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

    const feePayments = await FeePayment.find({ studentId: student._id });
    const outstandingFee = feePayments.reduce((sum, p) => sum + p.balanceAmount, 0);

    const notifications = await Notification.find({
      isActive: true,
      $or: [{ targetRoles: 'ALL' }, { targetRoles: 'STUDENT' }, { isPublic: true }],
    }).sort({ publicationDate: -1 }).limit(5);

    res.json({
      success: true,
      message: 'Student dashboard data',
      data: {
        timetable,
        attendancePercentage,
        recentResults,
        outstandingFee,
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
