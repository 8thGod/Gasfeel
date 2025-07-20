// puter.js
const Tesseract = require('tesseract.js');

module.exports = async function extractText(imagePath) {
  const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
  return { text };
};
