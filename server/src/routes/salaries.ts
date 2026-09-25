import { Router } from 'express';
import { SalaryProfile } from '../models/SalaryProfile';
import { SalaryRecord } from '../models/SalaryRecord';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/profiles', requireAuth, requireRole(['ADMIN']), async (_req, res, next) => {
  try {
    const profiles = await SalaryProfile.find({ isActive: true }).populate('teacherId', 'name');
    res.json({ success: true, message: 'Salary profiles retrieved', data: profiles });
  } catch (error) {
    next(error);
  }
});

router.post('/profiles', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { teacherId, baseSalary, allowances, deductions, effectiveDate } = req.body;
    if (!teacherId || !baseSalary || !effectiveDate) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const totalAllowances = (allowances || []).reduce((sum: number, a: any) => sum + a.amount, 0);
    const totalDeductions = (deductions || []).reduce((sum: number, d: any) => sum + d.amount, 0);
    const netSalary = baseSalary + totalAllowances - totalDeductions;

    const profile = await SalaryProfile.create({
      teacherId,
      baseSalary,
      allowances: allowances || [],
      deductions: deductions || [],
      netSalary,
      effectiveDate,
    });

    res.status(201).json({ success: true, message: 'Salary profile created', data: profile });
  } catch (error) {
    next(error);
  }
});

router.get('/records', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { month } = req.query;
    const query: any = {};
    if (month) query.month = month;

    const records = await SalaryRecord.find(query)
      .populate('teacherId', 'name')
      .sort({ month: -1 });
    res.json({ success: true, message: 'Salary records retrieved', data: records });
  } catch (error) {
    next(error);
  }
});

router.post('/records/generate', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { month } = req.body;
    if (!month) return res.status(400).json({ success: false, message: 'Month is required' });

    const profiles = await SalaryProfile.find({ isActive: true });
    const records = [];

    for (const profile of profiles) {
      const existing = await SalaryRecord.findOne({ teacherId: profile.teacherId, month });
      if (existing) continue;

      const totalAllowances = profile.allowances.reduce((sum, a) => sum + a.amount, 0);
      const totalDeductions = profile.deductions.reduce((sum, d) => sum + d.amount, 0);

      const record = await SalaryRecord.create({
        teacherId: profile.teacherId,
        salaryProfileId: profile._id,
        month,
        baseSalary: profile.baseSalary,
        totalAllowances,
        totalDeductions,
        netSalary: profile.netSalary,
        balanceAmount: profile.netSalary,
      });
      records.push(record);
    }

    res.status(201).json({ success: true, message: `${records.length} salary records generated`, data: records });
  } catch (error) {
    next(error);
  }
});

router.post('/records/:id/pay', requireAuth, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { paidAmount, paymentMethod, referenceNo, remarks } = req.body;
    const record = await SalaryRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Salary record not found' });

    record.paidAmount = (record.paidAmount || 0) + paidAmount;
    record.balanceAmount = record.netSalary - record.paidAmount;
    record.paymentDate = new Date();
    record.paymentMethod = paymentMethod;
    record.referenceNo = referenceNo;
    record.remarks = remarks;
    record.status = record.balanceAmount === 0 ? 'PAID' : record.paidAmount > 0 ? 'PARTIAL' : 'UNPAID';
    await record.save();

    res.json({ success: true, message: 'Salary payment recorded', data: record });
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard', requireAuth, requireRole(['ADMIN']), async (_req, res, next) => {
  try {
    const records = await SalaryRecord.find();
    const totalDue = records.reduce((sum, r) => sum + r.netSalary, 0);
    const totalPaid = records.reduce((sum, r) => sum + r.paidAmount, 0);
    const unpaidCount = records.filter(r => r.status === 'UNPAID').length;

    res.json({
      success: true,
      message: 'Salary dashboard',
      data: { totalDue, totalPaid, unpaidCount },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
