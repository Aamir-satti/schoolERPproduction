import { Router } from 'express';
import { FeeStructure } from '../models/FeeStructure';
import { FeePayment } from '../models/FeePayment';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Fee Structures
router.get('/structures', requireAuth, async (req, res, next) => {
  try {
    const { classId } = req.query;
    const query: any = { isActive: true };
    if (classId) query.classId = classId;

    const structures = await FeeStructure.find(query).populate('classId', 'name code');
    res.json({ success: true, message: 'Fee structures retrieved', data: structures });
  } catch (error) {
    next(error);
  }
});

router.post('/structures', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { name, classId, academicYear, components } = req.body;
    if (!name || !classId || !academicYear || !components) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const totalAmount = components.reduce((sum: number, c: any) => sum + c.amount, 0);
    const structure = await FeeStructure.create({ name, classId, academicYear, components, totalAmount });
    res.status(201).json({ success: true, message: 'Fee structure created', data: structure });
  } catch (error) {
    next(error);
  }
});

// Fee Ledger
router.get('/student/:studentId/ledger', requireAuth, async (req, res, next) => {
  try {
    const payments = await FeePayment.find({ studentId: req.params.studentId })
      .populate('feeStructureId', 'name')
      .sort({ month: -1 });

    const ledger = payments.map(p => ({
      month: p.month,
      component: p.component,
      totalAmount: p.totalAmount,
      paidAmount: p.paidAmount,
      balanceAmount: p.balanceAmount,
      status: p.status,
      payments: [p],
    }));

    res.json({ success: true, message: 'Fee ledger retrieved', data: ledger });
  } catch (error) {
    next(error);
  }
});

// Record Payment
router.post('/payments', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { studentId, feeStructureId, month, component, totalAmount, paidAmount, paymentMethod, referenceNo, remarks } = req.body;
    
    if (!studentId || !feeStructureId || !month || !component || !totalAmount || !paidAmount) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const balanceAmount = totalAmount - paidAmount;
    const status = balanceAmount === 0 ? 'PAID' : balanceAmount < totalAmount ? 'PARTIAL' : 'UNPAID';
    const challanNo = `CHL-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const payment = await FeePayment.create({
      studentId,
      feeStructureId,
      month,
      component,
      totalAmount,
      paidAmount,
      balanceAmount,
      paymentDate: new Date(),
      paymentMethod,
      referenceNo,
      remarks,
      status,
      challanNo,
    });

    res.status(201).json({ success: true, message: 'Payment recorded', data: payment });
  } catch (error) {
    next(error);
  }
});

// Dashboard
router.get('/dashboard', requireAuth, requireRole(['ADMIN']), async (_req, res, next) => {
  try {
    const payments = await FeePayment.find();
    const totalDue = payments.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalCollected = payments.reduce((sum, p) => sum + p.paidAmount, 0);
    const outstanding = totalDue - totalCollected;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthCollection = payments
      .filter(p => p.month === currentMonth)
      .reduce((sum, p) => sum + p.paidAmount, 0);

    res.json({
      success: true,
      message: 'Fee dashboard',
      data: { totalDue, totalCollected, outstanding, currentMonthCollection },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
