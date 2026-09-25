import { Router } from 'express';
import { Class } from '../models/Class';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/classes
router.get('/', requireAuth, async (_req, res, next) => {
  try {
    const classes = await Class.find({ isActive: true })
      .populate('classTeacherId', 'name')
      .sort({ name: 1 });
    res.json({ success: true, message: 'Classes retrieved', data: classes });
  } catch (error) {
    next(error);
  }
});

// GET /api/classes/:id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id).populate('classTeacherId', 'name');
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, message: 'Class retrieved', data: cls });
  } catch (error) {
    next(error);
  }
});

// POST /api/classes
router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { name, code, academicYear } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' });
    }

    const existing = await Class.findOne({ code });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Class code already exists' });
    }

    const cls = await Class.create({ name, code, academicYear });
    res.status(201).json({ success: true, message: 'Class created', data: cls });
  } catch (error) {
    next(error);
  }
});

// PUT /api/classes/:id
router.put('/:id', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { name, sections, classTeacherId } = req.body;
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (sections !== undefined) updateData.sections = sections;
    if (classTeacherId !== undefined) updateData.classTeacherId = classTeacherId;

    const cls = await Class.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, message: 'Class updated', data: cls });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/classes/:id/status
router.patch('/:id/status', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const cls = await Class.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, message: 'Class status updated', data: cls });
  } catch (error) {
    next(error);
  }
});

export default router;
