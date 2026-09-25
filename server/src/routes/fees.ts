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

// Record Payment - Updates existing fee obligation or creates new one
router.post('/payments', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { studentId, feeStructureId, month, component, totalAmount, paidAmount, paymentMethod, referenceNo, remarks } = req.body;
    
    if (!studentId || !feeStructureId || !month || !component || !paidAmount) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    if (paidAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Payment amount must be greater than zero' });
    }

    // Check if fee obligation already exists for this student/month/component
    let feePayment = await FeePayment.findOne({ studentId, month, component });

    if (feePayment) {
      // Update existing fee obligation
      feePayment.paidAmount += paidAmount;
      feePayment.balanceAmount = feePayment.totalAmount - feePayment.paidAmount;
      feePayment.paymentDate = new Date();
      feePayment.paymentMethod = paymentMethod;
      feePayment.referenceNo = referenceNo;
      feePayment.remarks = remarks;
      feePayment.status = feePayment.balanceAmount === 0 ? 'PAID' : feePayment.paidAmount > 0 ? 'PARTIAL' : 'UNPAID';
      
      if (feePayment.paidAmount > feePayment.totalAmount) {
        return res.status(400).json({ success: false, message: 'Payment exceeds outstanding balance' });
      }
      
      await feePayment.save();
    } else {
      // Create new fee obligation
      if (!totalAmount || totalAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Total amount is required for new fee obligations' });
      }

      if (paidAmount > totalAmount) {
        return res.status(400).json({ success: false, message: 'Payment cannot exceed total amount' });
      }

      const balanceAmount = totalAmount - paidAmount;
      const status = balanceAmount === 0 ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'UNPAID';
      const challanNo = `CHL-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      feePayment = await FeePayment.create({
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
    }

    res.status(201).json({ success: true, message: 'Payment recorded', data: feePayment });
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
