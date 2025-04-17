
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker path correctly
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

// Ensure the PDF.js library is properly configured
console.log("PDF.js worker configured with version:", pdfjsLib.version);

export default pdfjsLib;
