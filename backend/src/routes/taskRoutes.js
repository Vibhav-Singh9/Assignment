const express = require('express');
const authenticateJwt = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createTask, listTasks, getTask, updateTask, deleteTask, downloadDocument } = require('../controllers/taskController');

const router = express.Router();

router.use(authenticateJwt);

router.post('/', upload.handleUploadArray('documents', 3), createTask);
router.get('/', listTasks);
router.get('/:id', getTask);
router.put('/:id', upload.handleUploadArray('documents', 3), updateTask);
router.delete('/:id', deleteTask);
router.get('/:id/documents/:docId/download', downloadDocument);

module.exports = router;


