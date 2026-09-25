import { Router } from 'express';
import { Mark } from '../models/Mark';
import { Exam } from '../models/Exam';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/student/:studentId/exam/:examId', requireAuth, async (req, res, next) => {
  try {
    const marks = await Mark.find({
      studentId: req.params.studentId,
      examId: req.params.examId,
    }).populate('subjectId', 'name code');

    const exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    if (!exam.isPublished) {
      return res.status(403).json({ success: false, message: 'Results not published yet' });
    }

    const totalObtained = marks.reduce((sum, m) => sum + m.obtainedMarks, 0);
    const totalMax = marks.reduce((sum, m) => sum + m.maxMarks, 0);
    const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
    const allPassed = marks.every(m => m.isPassed);

    const result = {
      examId: exam,
      subjects: marks,
      totalObtained,
      totalMax,
      percentage,
      grade: percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F',
      resultStatus: allPassed ? 'PASS' : 'FAIL',
    };

    res.json({ success: true, message: 'Result retrieved', data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/student/:studentId', requireAuth, async (req, res, next) => {
  try {
    const exams = await Exam.find({ isPublished: true, classIds: { $exists: true } })
      .populate('classIds', 'name code')
      .sort({ startDate: -1 });

    const results = [];
    for (const exam of exams) {
      const marks = await Mark.find({
        studentId: req.params.studentId,
        examId: exam._id,
      }).populate('subjectId', 'name code');

      if (marks.length > 0) {
        const totalObtained = marks.reduce((sum, m) => sum + m.obtainedMarks, 0);
        const totalMax = marks.reduce((sum, m) => sum + m.maxMarks, 0);
        const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
        const allPassed = marks.every(m => m.isPassed);

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

export default router;
