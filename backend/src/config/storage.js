const path = require('path');

const storageType = (process.env.STORAGE_TYPE || 'local').toLowerCase();
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const maxFileSizeMb = parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10);

function resolveUploadPath(relativePath) {
  return path.join(process.cwd(), uploadDir, relativePath || '');
}

module.exports = {
  storageType,
  uploadDir,
  resolveUploadPath,
  maxFileSizeMb,
};


