import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const dataBuffer = fs.readFileSync('/tmp/nvc_book.pdf');
const uint8Array = new Uint8Array(dataBuffer);

async function extract() {
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;
  console.log('Total pages:', pdf.numPages);
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map(item => item.str).join(' ');
    fullText += `\n--- PAGE ${i} ---\n` + text + '\n';
    if (i % 20 === 0) console.log(`Processed page ${i}...`);
  }
  
  fs.writeFileSync('/tmp/nvc_text.txt', fullText);
  console.log('Done. Length:', fullText.length);
}

extract().catch(err => console.error('Error:', err.message));
