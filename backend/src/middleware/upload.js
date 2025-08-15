const fs = require('fs');
const path = require('path');
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const { storageType, uploadDir, maxFileSizeMb } = require('../config/storage');

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed'));
  }
  return cb(null, true);
};

let storage;
if (storageType === 's3') {
  const s3 = new AWS.S3({ region: process.env.AWS_REGION });
  storage = multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function key(req, file, cb) {
      const folder = `tasks/${req.params.id || 'new'}`;
      const filename = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
      cb(null, `${folder}/${filename}`);
    },
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
  });
} else {
  const dest = path.join(process.cwd(), uploadDir, 'tasks');
  ensureDirSync(dest);
  storage = multer.diskStorage({
    destination: function destination(req, file, cb) {
      cb(null, dest);
    },
    filename: function filename(req, file, cb) {
      const name = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
      cb(null, name);
    },
  });
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxFileSizeMb * 1024 * 1024, files: 3 },
});

function handleUploadArray(fieldName, maxCount = 3) {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      return next();
    });
  };
}

module.exports = Object.assign(upload, { handleUploadArray });


