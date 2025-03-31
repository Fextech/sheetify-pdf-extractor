
import { FileSpreadsheet } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-6 py-4 max-w-5xl">
        <div className="flex items-center">
          <FileSpreadsheet className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-xl font-bold text-gray-900">Sheetify PDF Extractor</h1>
          <div className="ml-auto text-right">
            <p className="text-sm text-gray-500">PDF to Google Sheets</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
