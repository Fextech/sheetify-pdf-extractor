
import { useState, useEffect } from "react";
import { File } from "lucide-react";

interface PdfPreviewProps {
  url: string;
}

const PdfPreview = ({ url }: PdfPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div className="bg-white rounded-lg shadow-sm h-full">
      <div className="p-4 border-b">
        <h3 className="font-medium">PDF Preview</h3>
      </div>
      
      <div className="p-2 h-[calc(100%-3.5rem)] min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="h-full">
            <iframe
              src={`${url}#toolbar=0&navpanes=0`}
              className="w-full h-full rounded border"
              title="PDF Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfPreview;
