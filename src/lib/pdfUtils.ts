
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extracts text from a PDF file using PDF.js
 * @param file The PDF file to extract text from
 * @param progressCallback A callback function to report progress
 * @returns A promise that resolves to an array of strings, each containing text from one page
 */
export async function extractTextFromPdf(
  file: File,
  progressCallback: (progress: number) => void
): Promise<string[]> {
  // Convert file to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Load the PDF document
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdfDocument = await loadingTask.promise;
  
  const totalPages = pdfDocument.numPages;
  const pageTexts: string[] = [];
  
  // Extract text from each page
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    try {
      // Get the page
      const page = await pdfDocument.getPage(pageNum);
      
      // Extract text content
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      pageTexts.push(pageText);
      
      // Update progress
      progressCallback((pageNum / totalPages) * 100);
    } catch (error) {
      console.error(`Error extracting text from page ${pageNum}:`, error);
      pageTexts.push(`[Error extracting text from page ${pageNum}]`);
    }
  }
  
  return pageTexts;
}

/**
 * Groups PDF page texts into cells, with 3 pages per cell
 * @param pageTexts Array of texts from individual PDF pages
 * @returns Array of cell texts, each containing text from 3 pages with separators
 */
export function groupPagesIntoCells(pageTexts: string[]): string[] {
  const cellTexts: string[] = [];
  
  for (let i = 0; i < pageTexts.length; i += 3) {
    const pagesForThisCell = pageTexts.slice(i, i + 3);
    
    // Join the pages with the new separator format [PAGE X]
    const cellText = pagesForThisCell.map((pageText, index) => {
      const pageNumber = i + index + 1;
      return `[PAGE ${pageNumber}]\n\n${pageText}\n\n`;
    }).join('\n');
    
    cellTexts.push(cellText);
  }
  
  return cellTexts;
}
