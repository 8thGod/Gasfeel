const express = require('express');
const bodyParser = require('body-parser');
const puter = require('./puter');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/ocr', async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required' });

  try {
    const result = await puter(imageUrl);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`OCR API listening on port ${port}`);
});
