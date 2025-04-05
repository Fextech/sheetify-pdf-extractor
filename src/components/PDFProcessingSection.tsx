
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import ProcessingStatus from "@/components/ProcessingStatus";
import { generateCsvDownload } from "@/lib/googleSheetsUtils";

interface PDFProcessingSectionProps {
  progress: number;
  totalPages: number;
  file: File | null;
  processedCellTexts: string[];
}

const PDFProcessingSection = ({
  progress,
  totalPages,
  file,
  processedCellTexts,
}: PDFProcessingSectionProps) => {
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
      const downloadUrl = await generateCsvDownload(processedCellTexts, file.name);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${file.name.replace('.pdf', '')}_spreadsheet.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
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
    <div>
      <ProcessingStatus progress={progress} totalPages={totalPages} />
      
      {progress === 100 && (
        <div className="mt-6">
          <button
            onClick={handleDownload}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Download Spreadsheet
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">
            This file will auto-delete after 30 minutes
          </p>
        </div>
      )}
    </div>
  );
};

export default PDFProcessingSection;
