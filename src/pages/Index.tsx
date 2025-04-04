
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import FileUpload from "@/components/FileUpload";
import ProcessingStatus from "@/components/ProcessingStatus";
import PdfPreview from "@/components/PdfPreview";
import Header from "@/components/Header";
import Instructions from "@/components/Instructions";
import { generateCsvDownload } from "@/lib/googleSheetsUtils";
import { extractTextFromPdf, groupPagesIntoCells } from "@/lib/pdfUtils";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedCellTexts, setProcessedCellTexts] = useState<string[]>([]);

  const handleFileSelected = (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      toast({
        variant: "destructive",
        title: "Invalid file format",
        description: "Please upload a PDF file",
      });
      return;
    }

    // Create a preview URL for the PDF
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setFile(selectedFile);
    
    // Mock function to estimate page count (would be replaced with actual PDF parsing)
    setTimeout(() => {
      // This would be replaced with actual PDF parsing to get the page count
      const estimatedPages = Math.floor(selectedFile.size / 3000);
      setTotalPages(estimatedPages);
    }, 500);
  };

  const startProcessing = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Extract text from PDF pages
      const pageTexts = await extractTextFromPdf(file, (progress) => {
        setProgress(progress / 2); // First half of the progress is text extraction
      });
      
      // Group the pages into cells (3 pages per cell)
      const cellTexts = groupPagesIntoCells(pageTexts);
      setProcessedCellTexts(cellTexts);
      
      // Simulate the second half of the processing
      let currentProgress = 50;
      const interval = setInterval(() => {
        currentProgress += 5;
        const percentage = Math.min(currentProgress, 100);
        setProgress(percentage);
        
        if (percentage >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            toast({
              title: "Processing complete",
              description: `Created a spreadsheet with ${cellTexts.length} cells containing all ${pageTexts.length} pages`,
            });
          }, 1000);
        }
      }, 200);
    } catch (error) {
      console.error("Error processing PDF:", error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: "There was an error processing your PDF.",
      });
    }
  };

  const handleDownload = async () => {
    if (!file || processedCellTexts.length === 0) {
      toast({
        variant: "destructive",
        title: "Nothing to download",
        description: "Please process a PDF file first",
      });
      return;
    }

    toast({
      title: "Download started",
      description: "Your spreadsheet is being prepared for download",
    });
    
    try {
      // Generate CSV and initiate download
      const downloadUrl = await generateCsvDownload(processedCellTexts, file.name);
      
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${file.name.replace('.pdf', '')}_spreadsheet.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
      
      toast({
        title: "Download complete",
        description: "Your spreadsheet has been downloaded successfully",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error preparing your download.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto p-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Upload PDF</h2>
              
              {!isProcessing ? (
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
                        Start Processing
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <ProcessingStatus progress={progress} totalPages={totalPages} />
              )}
              
              {progress === 100 && (
                <div className="mt-6">
                  <button
                    onClick={handleDownload}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Download Spreadsheet
                  </button>
                </div>
              )}
            </div>
            
            <Instructions />
          </div>
          
          <div className="md:col-span-5">
            {previewUrl && (
              <PdfPreview url={previewUrl} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
