import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/Pagination';
import { PastPeriodsPaginationListProps } from '@/types/tracking';

export function PastPeriodsPaginationList<T>({
  items,
  itemsPerPage,
  currentPage,
  onPageChange,
  renderItem,
  isOpen,
}: PastPeriodsPaginationListProps<T>) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(start, start + itemsPerPage);

  return (
    <div className={`overflow-hidden transition-all duration-350 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
      {paginatedItems.map((item, idx) => renderItem(item, idx))}

      {/* Pagination UI */}
      <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Math.max(1, currentPage - 1));
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  isActive={pageNum === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(pageNum);
                  }}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Math.min(totalPages, currentPage + 1));
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
