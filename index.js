const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const puter = require('./puter');

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🧠 OCR API is running. Use POST /api/run');
});

app.post('/api/run', upload.single('image'), async (req, res) => {
  try {
    const imagePath = path.resolve(req.file.path);
    const result = await puter(imagePath);

    // Clean up
    fs.unlinkSync(imagePath);

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`✅ OCR API listening on port ${port}`);
});
