import { Router } from 'express';
import { Subject } from '../models/Subject';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { classId } = req.query;
    const query: any = { isActive: true };
    if (classId) query.classIds = classId;

    const subjects = await Subject.find(query)
      .populate('classIds', 'name code')
      .populate('teacherIds', 'name')
      .sort({ name: 1 });
    res.json({ success: true, message: 'Subjects retrieved', data: subjects });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { name, code, classIds, teacherIds } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' });
    }

    const existing = await Subject.findOne({ code });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Subject code already exists' });
    }

    const subject = await Subject.create({ name, code, classIds: classIds || [], teacherIds: teacherIds || [] });
    res.status(201).json({ success: true, message: 'Subject created', data: subject });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { name, classIds, teacherIds } = req.body;
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (classIds !== undefined) updateData.classIds = classIds;
    if (teacherIds !== undefined) updateData.teacherIds = teacherIds;

    const subject = await Subject.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, message: 'Subject updated', data: subject });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const subject = await Subject.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, message: 'Subject status updated', data: subject });
  } catch (error) {
    next(error);
  }
});

export default router;
