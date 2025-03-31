
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import FileUpload from "@/components/FileUpload";
import ProcessingStatus from "@/components/ProcessingStatus";
import PdfPreview from "@/components/PdfPreview";
import Header from "@/components/Header";
import Instructions from "@/components/Instructions";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const startProcessing = () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate processing
    const totalCells = Math.ceil(totalPages / 3);
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += 1;
      const percentage = Math.min((currentProgress / totalCells) * 100, 100);
      setProgress(percentage);
      
      if (percentage >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          toast({
            title: "Processing complete",
            description: `Created a spreadsheet with ${totalCells} cells containing all ${totalPages} pages`,
          });
        }, 1000);
      }
    }, 200);
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your spreadsheet is being prepared for download",
    });
    
    // In a real application, this would trigger the download of the actual Google Sheet
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Your spreadsheet has been downloaded successfully",
      });
    }, 2000);
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
