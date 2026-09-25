import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { Mark } from '../models/Mark';
import { Teacher } from '../models/Teacher';
import { Exam } from '../models/Exam';
import { env } from '../config/env';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

router.post('/', requireAuth, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const { examId, subjectId, marks } = req.body;
    if (!examId || !subjectId || !marks || !Array.isArray(marks)) {
      return res.status(400).json({ success: false, message: 'examId, subjectId, and marks array are required' });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const decoded = jwt.verify(token!, env.JWT_ACCESS_SECRET) as { userId: string };

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    const examSubject = exam.subjects.find(s => s.subjectId.toString() === subjectId);
    if (!examSubject) return res.status(400).json({ success: false, message: 'Subject not found in exam' });

    const results = [];
    for (const mark of marks) {
      const { studentId, obtainedMarks, remarks } = mark;
      
      if (obtainedMarks < 0 || obtainedMarks > examSubject.maxMarks) {
        continue; // Skip invalid marks
      }

      const percentage = (obtainedMarks / examSubject.maxMarks) * 100;
      const grade = calculateGrade(percentage);
      const isPassed = obtainedMarks >= examSubject.passingMarks;

      const existingMark = await Mark.findOne({ studentId, examId, subjectId });
      if (existingMark) {
        existingMark.obtainedMarks = obtainedMarks;
        existingMark.grade = grade;
        existingMark.isPassed = isPassed;
        await existingMark.save();
        results.push(existingMark);
      } else {
        const newMark = await Mark.create({
          studentId,
          examId,
          subjectId,
          obtainedMarks,
          maxMarks: examSubject.maxMarks,
          passingMarks: examSubject.passingMarks,
          grade,
          isPassed,
          enteredBy: decoded.userId,
        });
        results.push(newMark);
      }
    }

    res.json({ success: true, message: `Marks entered for ${results.length} students`, data: results });
  } catch (error) {
    next(error);
  }
});

router.get('/exam/:examId/student/:studentId', requireAuth, async (req, res, next) => {
  try {
    const marks = await Mark.find({
      examId: req.params.examId,
      studentId: req.params.studentId,
    }).populate('subjectId', 'name code');
    res.json({ success: true, message: 'Marks retrieved', data: marks });
  } catch (error) {
    next(error);
  }
});

export default router;
