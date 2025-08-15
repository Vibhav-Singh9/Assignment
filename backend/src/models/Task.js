const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true,
    },
    dueDate: { type: Date, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    documents: { type: [DocumentSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);


