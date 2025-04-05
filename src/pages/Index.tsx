
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import PDFUploadSection from "@/components/PDFUploadSection";
import PDFProcessingSection from "@/components/PDFProcessingSection";
import Instructions from "@/components/Instructions";
import PdfPreview from "@/components/PdfPreview";
import Header from "@/components/Header";
import { setupCleanupJob, testSupabaseConnection } from "@/lib/supabase";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedCellTexts, setProcessedCellTexts] = useState<string[]>([]);
  const [extractionId, setExtractionId] = useState<string | null>(null);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

  useEffect(() => {
    setupCleanupJob();
    
    const checkConnection = async () => {
      const isConnected = await testSupabaseConnection();
      setDbConnected(isConnected);
      
      if (isConnected) {
        toast({
          title: "Database Connected",
          description: "Successfully connected to Supabase database",
          variant: "default"
        });
      } else {
        toast({
          title: "Database Connection Issue",
          description: "Could not connect to the Supabase database. Check your environment variables.",
          variant: "destructive"
        });
      }
    };
    
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto p-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Upload PDF</h2>
              
              {dbConnected === false && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded text-yellow-800 text-sm">
                  ⚠️ Database connection issue detected. Your extractions won't be saved. Check console for details.
                </div>
              )}
              
              {!isProcessing ? (
                <PDFUploadSection 
                  file={file}
                  totalPages={totalPages}
                  isProcessing={isProcessing}
                  setFile={setFile}
                  setTotalPages={setTotalPages}
                  setPreviewUrl={setPreviewUrl}
                  setIsProcessing={setIsProcessing}
                  setProgress={setProgress}
                  setProcessedCellTexts={setProcessedCellTexts}
                  setExtractionId={setExtractionId}
                />
              ) : (
                <PDFProcessingSection 
                  progress={progress}
                  totalPages={totalPages}
                  file={file}
                  processedCellTexts={processedCellTexts}
                />
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
