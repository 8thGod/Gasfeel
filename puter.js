// puter.js
const Tesseract = require('tesseract.js');

module.exports = async function extractText(imageUrl) {
  const { data: { text } } = await Tesseract.recognize(
    imageUrl,
    'eng',
    { logger: m => console.log(m) }
  );
  return { text };
};
