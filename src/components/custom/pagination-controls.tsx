import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react';

interface PaginationControlsProps {
  page: number;
  size: number;
  totalItems: number;
  showPageSizeSelect?: boolean;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const PaginationControls = ({
  page,
  size,
  totalItems,
  showPageSizeSelect = true,
  pageSizeOptions = [10, 20, 30, 40, 50, 100],
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) => {
  const totalPages = Math.max(Math.ceil(totalItems / size), 1);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const handlePageChange = (newPage: number) => {
    if (onPageChange) onPageChange(newPage);
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    if (onPageSizeChange) onPageSizeChange(newSize);
    handlePageChange(1);
  };

  return (
    <div className="flex items-center justify-between py-4 w-full">
      <div className="flex justify-between items-center gap-12">
        {showPageSizeSelect && (
          <div className="flex items-center gap-2">
            <Select value={`${size}`} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-20">
                <SelectValue placeholder={size} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(1)}
            disabled={!canPrev}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!canPrev}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!canNext}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 lg:flex"
            size="icon"
            onClick={() => handlePageChange(totalPages)}
            disabled={!canNext}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;