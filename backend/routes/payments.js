const express = require('express');
const router = express.Router();

// Mock payments data (to be replaced with database)
let mockPayments = [
  {
    id: '1',
    student_id: '1',
    student_name: 'John Doe',
    amount: 1500.00,
    payment_method: 'momo',
    reference_id: 'MTN123456789',
    operator: 'MTN',
    recorded_by: '1',
    payment_date: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

// GET /api/payments - Get all payments
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockPayments,
      count: mockPayments.length
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// GET /api/payments/:id - Get single payment
router.get('/:id', (req, res) => {
  try {
    const payment = mockPayments.find(p => p.id === req.params.id);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// POST /api/payments - Record new payment
router.post('/', (req, res) => {
  try {
    const {
      student_id,
      student_name,
      amount,
      payment_method,
      reference_id,
      operator
    } = req.body;

    // Basic validation
    if (!student_id || !amount || !payment_method || !reference_id) {
      return res.status(400).json({ 
        error: 'Missing required fields: student_id, amount, payment_method, reference_id' 
      });
    }

    // Create new payment
    const newPayment = {
      id: (mockPayments.length + 1).toString(),
      student_id,
      student_name,
      amount: parseFloat(amount),
      payment_method,
      reference_id,
      operator: operator || null,
      recorded_by: '1', // TODO: Get from JWT token
      payment_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    mockPayments.push(newPayment);

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: newPayment
    });

  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// GET /api/payments/student/:studentId - Get payments for specific student
router.get('/student/:studentId', (req, res) => {
  try {
    const studentPayments = mockPayments.filter(p => p.student_id === req.params.studentId);

    res.json({
      success: true,
      data: studentPayments,
      count: studentPayments.length
    });
  } catch (error) {
    console.error('Get student payments error:', error);
    res.status(500).json({ error: 'Failed to fetch student payments' });
  }
});

module.exports = router;