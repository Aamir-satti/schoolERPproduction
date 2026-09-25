import { Router } from 'express';
import { Timetable } from '../models/Timetable';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const timetables = await Timetable.find()
      .populate('classId', 'name code')
      .populate('subjectId', 'name code')
      .populate('teacherId', 'name')
      .sort({ dayOfWeek: 1, startTime: 1 });
    res.json({ success: true, message: 'Timetables retrieved', data: timetables });
  } catch (error) {
    next(error);
  }
});

router.get('/class/:classId/section/:sectionId', requireAuth, async (req, res, next) => {
  try {
    const timetables = await Timetable.find({
      classId: req.params.classId,
      sectionId: req.params.sectionId,
    })
      .populate('subjectId', 'name code')
      .populate('teacherId', 'name')
      .sort({ dayOfWeek: 1, startTime: 1 });
    res.json({ success: true, message: 'Class timetable retrieved', data: timetables });
  } catch (error) {
    next(error);
  }
});

router.get('/teacher/:teacherId', requireAuth, async (req, res, next) => {
  try {
    const timetables = await Timetable.find({ teacherId: req.params.teacherId })
      .populate('classId', 'name code')
      .populate('subjectId', 'name code')
      .sort({ dayOfWeek: 1, startTime: 1 });
    res.json({ success: true, message: 'Teacher timetable retrieved', data: timetables });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { classId, sectionId, subjectId, teacherId, dayOfWeek, startTime, endTime, roomNo } = req.body;
    if (!classId || !subjectId || !teacherId || !dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    // Check for teacher conflict
    const teacherConflict = await Timetable.findOne({
      teacherId,
      dayOfWeek,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });
    if (teacherConflict) {
      return res.status(409).json({ success: false, message: 'Teacher has a scheduling conflict' });
    }

    const timetable = await Timetable.create({ classId, sectionId, subjectId, teacherId, dayOfWeek, startTime, endTime, roomNo });
    const populated = await Timetable.findById(timetable._id)
      .populate('classId', 'name code')
      .populate('subjectId', 'name code')
      .populate('teacherId', 'name');
    res.status(201).json({ success: true, message: 'Timetable entry created', data: populated });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('classId', 'name code')
      .populate('subjectId', 'name code')
      .populate('teacherId', 'name');
    if (!timetable) return res.status(404).json({ success: false, message: 'Timetable entry not found' });
    res.json({ success: true, message: 'Timetable updated', data: timetable });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) return res.status(404).json({ success: false, message: 'Timetable entry not found' });
    res.json({ success: true, message: 'Timetable entry deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
