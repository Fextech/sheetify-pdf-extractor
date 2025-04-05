
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker - use a more reliable approach by creating a local worker
// Instead of using CDN which can be unreliable
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs');

if (typeof window !== 'undefined' && 'pdfjsWorker' in window === false) {
  // @ts-ignore
  window.pdfjsWorker = pdfjsWorker;
}

// Set worker source manually instead of relying on CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default pdfjsLib;
