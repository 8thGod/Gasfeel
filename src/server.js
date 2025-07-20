const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();

// Log paths for debugging
console.log('__dirname:', __dirname);
console.log('Public path:', path.join(__dirname, '..', 'public'));
console.log('index.html exists:', fs.existsSync(path.join(__dirname, '..', 'public', 'index.html')));

// Serve static files from the 'public' directory in the project root
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve the HTML for browser-based testing
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '..', 'public', 'index.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'index.html not found' });
    }
});

// OCR API endpoint (handles both URLs and base64 data URIs)
app.get('/ocr', async (req, res) => {
    const imageInput = req.query.url;
    if (!imageInput) {
        return res.status(400).json({ error: 'No image input provided' });
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto('data:text/html,<script src="https://js.puter.com/v2/"></script>', { waitUntil: 'networkidle0' });
        const text = await page.evaluate(async (input) => {
            return await puter.ai.img2txt(input);
        }, imageInput);
        await browser.close();
        res.json({ extractedText: text || 'No text found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
