import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { Notification } from '../models/Notification';
import { env } from '../config/env';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const decoded = jwt.verify(token!, env.JWT_ACCESS_SECRET) as { role: string };

    const query: any = { isActive: true };
    if (decoded.role !== 'ADMIN') {
      query.$or = [
        { targetRoles: 'ALL' },
        { targetRoles: decoded.role },
        { isPublic: true },
      ];
    }

    const notifications = await Notification.find(query)
      .populate('createdBy', 'name')
      .sort({ publicationDate: -1 });
    res.json({ success: true, message: 'Notifications retrieved', data: notifications });
  } catch (error) {
    next(error);
  }
});

router.get('/public', async (_req, res, next) => {
  try {
    const notifications = await Notification.find({ isPublic: true, isActive: true })
      .populate('createdBy', 'name')
      .sort({ publicationDate: -1 })
      .limit(20);
    res.json({ success: true, message: 'Public notifications retrieved', data: notifications });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const decoded = jwt.verify(token!, env.JWT_ACCESS_SECRET) as { userId: string };

    const { title, message, type, isPublic, targetRoles, externalLink, publicationDate, expiryDate } = req.body;
    if (!title || !message || !publicationDate) {
      return res.status(400).json({ success: false, message: 'Title, message, and publication date are required' });
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || 'GENERAL',
      isPublic: isPublic || false,
      targetRoles: targetRoles || ['ALL'],
      externalLink,
      publicationDate: new Date(publicationDate),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      createdBy: decoded.userId,
    });

    res.status(201).json({ success: true, message: 'Notification created', data: notification });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, message: 'Notification updated', data: notification });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
