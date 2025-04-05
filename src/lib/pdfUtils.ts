
import pdfjsLib from './pdfJsConfig';

/**
 * Extracts text from a PDF file using pdf.js
 * @param file The PDF file to extract text from
 * @param progressCallback A callback function to report progress
 * @returns A promise that resolves to an array of strings, each containing text from one page
 */
export async function extractTextFromPdf(
  file: File,
  progressCallback: (progress: number) => void
): Promise<string[]> {
  try {
    console.log("Starting PDF text extraction...");
    // Convert File object to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Create loading task with better error handling
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    
    // Add progress callback to the loading task
    loadingTask.onProgress = (progress) => {
      const percent = progress.total ? Math.round((progress.loaded / progress.total) * 20) : 0;
      progressCallback(percent);
    };
    
    // Load the PDF document
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded with ${pdf.numPages} pages`);
    
    const totalPages = pdf.numPages;
    const pageTexts: string[] = [];
    
    // Extract text from each page
    for (let i = 1; i <= totalPages; i++) {
      // Update progress (20% for loading + 80% for processing pages)
      progressCallback(20 + Math.floor((i / totalPages) * 80));
      
      try {
        // Get page
        console.log(`Processing page ${i}/${totalPages}`);
        const page = await pdf.getPage(i);
        
        // Extract text content
        const textContent = await page.getTextContent();
        let pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        // If page is empty, add a note
        if (!pageText.trim()) {
          pageText = '[This page appears to be empty or contains only images]';
        }
        
        pageTexts.push(pageText);
      } catch (pageError) {
        console.error(`Error processing page ${i}:`, pageError);
        pageTexts.push(`[Error extracting text from page ${i}]`);
      }
    }
    
    console.log("PDF text extraction complete");
    return pageTexts;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
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
