const fileUpload = require('express-fileupload');
const path = require('path');

const upload = fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  useTempFiles: true,
  tempFileDir: path.join(__dirname, '../uploads/temp'),
  createParentPath: true
});

module.exports = upload; 