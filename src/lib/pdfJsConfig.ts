
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker path to use the bundled worker from node_modules
// This resolves the issue with the worker not being found
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default pdfjsLib;
