import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import FileUpload from "@/components/FileUpload";
import { extractTextFromPdf, groupPagesIntoCells } from "@/lib/pdfUtils";
import { savePdfExtraction } from "@/lib/supabase";
import pdfjsLib from "@/lib/pdfJsConfig";

interface PDFUploadSectionProps {
  file: File | null;
  totalPages: number;
  isProcessing: boolean;
  setFile: (file: File | null) => void;
  setTotalPages: (pages: number) => void;
  setPreviewUrl: (url: string | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setProgress: (progress: number) => void;
  setProcessedCellTexts: (texts: string[]) => void;
  setExtractionId: (id: string | null) => void;
}

const PDFUploadSection = ({
  file,
  totalPages,
  isProcessing,
  setFile,
  setTotalPages,
  setPreviewUrl,
  setIsProcessing,
  setProgress,
  setProcessedCellTexts,
  setExtractionId
}: PDFUploadSectionProps) => {
  const handleFileSelected = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      toast({
        variant: "destructive",
        title: "Invalid file format",
        description: "Please upload a PDF file",
      });
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setFile(selectedFile);
    setIsProcessing(true);

    try {
      console.log("Loading PDF to get page count...");
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/standard_fonts/',
      });
      
      loadingTask.onProgress = (progress) => {
        const percent = progress.total ? Math.round((progress.loaded / progress.total) * 100) : 0;
        console.log(`Loading PDF: ${percent}%`);
        setProgress(percent / 4);
      };
      
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      
      setTotalPages(numPages);
      setIsProcessing(false);
      setProgress(0);
      
      toast({
        title: "PDF Loaded",
        description: `PDF has ${numPages} pages`,
      });
    } catch (error) {
      console.error("Error getting PDF page count:", error);
      let errorMessage = "Could not determine page count. Please try another PDF file.";
      
      if (error instanceof Error && error.message.includes('worker')) {
        errorMessage = "PDF worker failed to load. Please check your internet connection and try again.";
      }
      
      toast({
        variant: "destructive",
        title: "Error analyzing PDF",
        description: errorMessage,
      });
      
      setFile(null);
      setPreviewUrl(null);
      setTotalPages(0);
      setIsProcessing(false);
    }
  };

  const startProcessing = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      console.log("Starting PDF processing...");
      
      const pageTexts = await extractTextFromPdf(file, (progress) => {
        setProgress(progress / 2);
        console.log(`Extraction progress: ${progress}%`);
      });
      
      console.log(`Extracted ${pageTexts.length} pages of text`);
      
      const cellTexts = groupPagesIntoCells(pageTexts);
      setProcessedCellTexts(cellTexts);
      
      setProgress(75);
      
      try {
        const savedExtraction = await savePdfExtraction(file.name, pageTexts);
        if (savedExtraction?.id) {
          setExtractionId(savedExtraction.id);
          console.log(`Saved extraction with ID: ${savedExtraction.id}`);
        } else {
          console.warn("Extraction was processed but not saved to database");
        }
      } catch (dbError) {
        console.warn("Could not save to database, but PDF was processed", dbError);
      }
      
      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        toast({
          title: "Processing complete",
          description: `Created a spreadsheet with ${cellTexts.length} cells containing all ${pageTexts.length} pages`,
        });
      }, 1000);
    } catch (error) {
      console.error("Error processing PDF:", error);
      setIsProcessing(false);
      setProgress(0);
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: "There was an error processing your PDF. Please try another file.",
      });
    }
  };

  return (
    <>
      <FileUpload 
        onFileSelected={handleFileSelected} 
        isProcessing={isProcessing}
      />
      
      {file && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{file.name}</span>
            <span className="text-sm text-gray-500">
              {totalPages > 0 ? `${totalPages} pages (${Math.ceil(totalPages / 3)} cells)` : "Analyzing..."}
            </span>
          </div>
          
          <button
            onClick={startProcessing}
            disabled={isProcessing || totalPages === 0}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? "Processing..." : "Start Processing"}
          </button>
        </div>
      )}
    </>
  );
};

export default PDFUploadSection;
