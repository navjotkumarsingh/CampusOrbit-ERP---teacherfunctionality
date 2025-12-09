const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    admissionNumber: String,
    semester: Number,
    academicYear: String,
    feeStructure: {
      tuitionFee: Number,
      labFee: Number,
      libraryFee: Number,
      sportsFee: Number,
      otherFee: Number,
    },
    totalFee: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    pendingAmount: {
      type: Number,
      required: true,
    },
    dueDate: Date,
    feePayments: [
      {
        amount: Number,
        paymentDate: Date,
        paymentMethod: {
          type: String,
          enum: ['cash', 'check', 'online', 'transfer'],
        },
        transactionId: String,
        status: {
          type: String,
          enum: ['pending', 'completed', 'failed'],
        },
        remarks: String,
      },
    ],
    feeStatus: {
      type: String,
      enum: ['paid', 'pending', 'overdue', 'partial'],
      default: 'pending',
    },
    lastReminderSent: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Fee', feeSchema);
