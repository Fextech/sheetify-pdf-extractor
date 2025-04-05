
import * as pdfjsLib from 'pdfjs-dist';

// Use a local worker path instead of CDN which is causing issues
const pdfWorkerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

// Initialize pdf.js workerSrc with local worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

export default pdfjsLib;
