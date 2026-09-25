import { Router } from 'express';
import { Exam } from '../models/Exam';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { classId, status } = req.query;
    const query: any = {};
    if (classId) query.classIds = classId;
    if (status) query.status = status;

    const exams = await Exam.find(query)
      .populate('classIds', 'name code')
      .populate('subjects.subjectId', 'name code')
      .sort({ startDate: -1 });
    res.json({ success: true, message: 'Exams retrieved', data: exams });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('classIds', 'name code')
      .populate('subjects.subjectId', 'name code');
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, message: 'Exam retrieved', data: exam });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { name, term, academicYear, classIds, subjects, startDate, endDate } = req.body;
    if (!name || !term || !academicYear || !classIds || !subjects || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const exam = await Exam.create({ name, term, academicYear, classIds, subjects, startDate, endDate });
    const populated = await Exam.findById(exam._id)
      .populate('classIds', 'name code')
      .populate('subjects.subjectId', 'name code');
    res.status(201).json({ success: true, message: 'Exam created', data: populated });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('classIds', 'name code')
      .populate('subjects.subjectId', 'name code');
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, message: 'Exam updated', data: exam });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, message: 'Exam deleted' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { status, isPublished } = req.body;
    const updateData: any = {};
    if (status) updateData.status = status;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const exam = await Exam.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, message: 'Exam status updated', data: exam });
  } catch (error) {
    next(error);
  }
});

export default router;
