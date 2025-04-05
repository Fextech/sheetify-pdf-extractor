
import * as pdfjsLib from 'pdfjs-dist';

// Initialize pdf.js workerSrc
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default pdfjsLib;
