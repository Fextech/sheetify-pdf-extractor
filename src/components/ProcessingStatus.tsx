
import { Progress } from "@/components/ui/progress";

interface ProcessingStatusProps {
  progress: number;
  totalPages: number;
}

const ProcessingStatus = ({ progress, totalPages }: ProcessingStatusProps) => {
  const totalCells = Math.ceil(totalPages / 3);
  const currentCell = Math.ceil((progress / 100) * totalCells);
  
  return (
    <div className="py-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Processing PDF</span>
        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-500">
          Processing cell {currentCell} of {totalCells}
        </div>
        <div className="mt-1 text-xs text-gray-400">
          Each cell contains 3 pages of text
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        <span className="ml-3 text-sm font-medium text-gray-700">
          Extracting text and creating spreadsheet...
        </span>
      </div>
    </div>
  );
};

export default ProcessingStatus;
