
import { FileText, Database, CheckSquare } from "lucide-react";

const Instructions = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <h2 className="text-xl font-semibold mb-4">How It Works</h2>
      
      <div className="space-y-4">
        <div className="flex">
          <div className="mr-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">1. Upload Your PDF</h3>
            <p className="text-sm text-gray-600 mt-1">
              Upload your PDF document (up to 2,500 pages).
            </p>
          </div>
        </div>
        
        <div className="flex">
          <div className="mr-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">2. Process Your PDF</h3>
            <p className="text-sm text-gray-600 mt-1">
              Our system extracts text from your PDF, organizing 3 pages per cell with clear page separations.
            </p>
          </div>
        </div>
        
        <div className="flex">
          <div className="mr-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <CheckSquare className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">3. Download Spreadsheet</h3>
            <p className="text-sm text-gray-600 mt-1">
              Download your formatted spreadsheet with all PDF text properly organized.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-blue-50 rounded text-sm text-blue-800 border border-blue-100">
        <p><strong>Note:</strong> For a 600-page PDF, you'll get 200 cells in your spreadsheet (3 pages per cell).</p>
      </div>
    </div>
  );
};

export default Instructions;
