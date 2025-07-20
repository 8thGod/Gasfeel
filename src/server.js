const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
// Serve static files from the 'public' directory in the project root
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve the HTML for browser-based testing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// OCR API endpoint
app.get('/ocr', async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) {
        return res.status(400).json({ error: 'No image URL provided' });
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for Render
        });
        const page = await browser.newPage();
        await page.goto('data:text/html,<script src="https://js.puter.com/v2/"></script>', { waitUntil: 'networkidle0' });
        const text = await page.evaluate(async (url) => {
            return await puter.ai.img2txt(url);
        }, imageUrl);
        await browser.close();
        res.json({ extractedText: text || 'No text found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 10000; // Match Render's port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
