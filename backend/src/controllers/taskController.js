const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const Task = require('../models/Task');
const { storageType, uploadDir } = require('../config/storage');

function buildQuery(query, user) {
  const filter = {};
  if (user.role !== 'admin') {
    filter.assignedTo = user.id;
  } else if (query.assignedTo) {
    filter.assignedTo = query.assignedTo;
  }
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.dueDateFrom || query.dueDateTo) {
    filter.dueDate = {};
    if (query.dueDateFrom) filter.dueDate.$gte = new Date(query.dueDateFrom);
    if (query.dueDateTo) filter.dueDate.$lte = new Date(query.dueDateTo);
  }
  const sort = {};
  if (query.sortBy) {
    const direction = query.order === 'asc' ? 1 : -1;
    sort[query.sortBy] = direction;
  } else {
    sort.createdAt = -1;
  }
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || '10', 10), 1), 100);
  const skip = (page - 1) * limit;
  return { filter, sort, page, limit, skip };
}

async function createTask(req, res) {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const owner = req.user.role === 'admin' && assignedTo ? assignedTo : req.user.id;
    const docs = (req.files || []).slice(0, 3).map((f) => ({
      filename: f.originalname,
      path: storageType === 's3' ? f.key : path.posix.join('tasks', path.basename(f.path || f.key)),
      size: f.size,
      mimetype: f.mimetype,
    }));
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo: owner,
      documents: docs,
    });
    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function listTasks(req, res) {
  try {
    const { filter, sort, page, limit, skip } = buildQuery(req.query, req.user);
    const [items, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);
    return res.json({ items, total, page, limit });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && String(task.assignedTo) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function updateTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && String(task.assignedTo) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (req.user.role === 'admin' && assignedTo !== undefined) task.assignedTo = assignedTo;

    const newDocs = (req.files || []).slice(0, 3).map((f) => ({
      filename: f.originalname,
      path: storageType === 's3' ? f.key : path.posix.join('tasks', path.basename(f.path || f.key)),
      size: f.size,
      mimetype: f.mimetype,
    }));
    if (newDocs.length > 0) {
      task.documents = [...task.documents, ...newDocs].slice(0, 3);
    }

    await task.save();
    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function deleteTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && String(task.assignedTo) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await task.deleteOne();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function downloadDocument(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && String(task.assignedTo) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const doc = task.documents.id(req.params.docId) || task.documents.find((d) => String(d._id) === req.params.docId);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    if (storageType === 's3') {
      const s3 = new AWS.S3({ region: process.env.AWS_REGION });
      const signedUrl = s3.getSignedUrl('getObject', {
        Bucket: process.env.S3_BUCKET,
        Key: doc.path,
        Expires: 60,
      });
      return res.json({ url: signedUrl });
    }

    const fullPath = path.join(process.cwd(), uploadDir, doc.path);
    if (!fs.existsSync(fullPath)) return res.status(404).json({ message: 'File not found' });
    res.setHeader('Content-Type', doc.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${doc.filename}"`);
    return fs.createReadStream(fullPath).pipe(res);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { createTask, listTasks, getTask, updateTask, deleteTask, downloadDocument };


