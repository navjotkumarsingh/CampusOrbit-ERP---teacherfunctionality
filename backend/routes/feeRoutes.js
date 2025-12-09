const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, roleMiddleware(['admin']), feeController.createFeeStructure);
router.post('/payment', authMiddleware, roleMiddleware(['admin', 'student']), feeController.recordFeePayment);
router.get('/student/:studentId', authMiddleware, roleMiddleware(['student', 'admin']), feeController.getStudentFees);
router.get('/', authMiddleware, roleMiddleware(['admin']), feeController.getAllFees);
router.get('/pending/all', authMiddleware, roleMiddleware(['admin']), feeController.getPendingFees);
router.get('/report/generate', authMiddleware, roleMiddleware(['admin']), feeController.generateFeeReport);

module.exports = router;
