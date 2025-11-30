import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "./ui/pagination";
import { cn } from "./ui/utils";

interface BookingPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BookingPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BookingPaginationProps) {
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              size="default"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
              isActive={currentPage === i}
              className={cn(
                "cursor-pointer border transition-colors",
                currentPage === i
                  ? "border-[#4F46E5] bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20"
                  : "border-slate-800 bg-[#1A2235] text-slate-300 hover:bg-[#1F2943] hover:text-white hover:border-slate-700"
              )}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                size="default"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(i);
                }}
                isActive={currentPage === i}
                className={cn(
                  "cursor-pointer border transition-colors",
                  currentPage === i
                    ? "border-[#4F46E5] bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20"
                    : "border-slate-800 bg-[#1A2235] text-slate-300 hover:bg-[#1F2943] hover:text-white hover:border-slate-700"
                )}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis className="text-slate-500" />
          </PaginationItem>
        );
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              size="default"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(totalPages);
              }}
              className={cn(
                "cursor-pointer border transition-colors",
                currentPage === totalPages
                  ? "border-[#4F46E5] bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20"
                  : "border-slate-800 bg-[#1A2235] text-slate-300 hover:bg-[#1F2943] hover:text-white hover:border-slate-700"
              )}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (currentPage >= totalPages - 2) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              size="default"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(1);
              }}
              className={cn(
                "cursor-pointer border transition-colors",
                currentPage === 1
                  ? "border-[#4F46E5] bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20"
                  : "border-slate-800 bg-[#1A2235] text-slate-300 hover:bg-[#1F2943] hover:text-white hover:border-slate-700"
              )}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis className="text-slate-500" />
          </PaginationItem>
        );
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                size="default"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(i);
                }}
                isActive={currentPage === i}
                className={cn(
                  "cursor-pointer border transition-colors",
                  currentPage === i
                    ? "border-[#4F46E5] bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20"
                    : "border-slate-800 bg-[#1A2235] text-slate-300 hover:bg-[#1F2943] hover:text-white hover:border-slate-700"
                )}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } else {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              size="default"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(1);
              }}
              className={cn(
                "cursor-pointer border transition-colors",
                currentPage === 1
                  ? "border-[#4F46E5] bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20"
                  : "border-slate-800 bg-[#1A2235] text-slate-300 hover:bg-[#1F2943] hover:text-white hover:border-slate-700"
              )}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis className="text-slate-500" />
          </PaginationItem>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                size="default"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(i);
                }}
                isActive={currentPage === i}
                className={cn(
                  "cursor-pointer border transition-colors",
                  currentPage === i
                    ? "border-[#4F46E5] bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20"
                    : "border-slate-800 bg-[#1A2235] text-slate-300 hover:bg-[#1F2943] hover:text-white hover:border-slate-700"
                )}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis className="text-slate-500" />
          </PaginationItem>
        );
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              size="default"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(totalPages);
              }}
              className={cn(
                "cursor-pointer border transition-colors",
                currentPage === totalPages
                  ? "border-[#4F46E5] bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20"
                  : "border-slate-800 bg-[#1A2235] text-slate-300 hover:bg-[#1F2943] hover:text-white hover:border-slate-700"
              )}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8">
      <Pagination>
        <PaginationContent className="flex-wrap gap-2">
          <PaginationItem>
            <PaginationPrevious
              size="default"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={cn(
                "border border-slate-800 bg-[#1A2235] text-slate-300 hover:bg-[#1F2943] hover:text-white hover:border-slate-700 transition-colors",
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              )}
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              size="default"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={cn(
                "border border-slate-800 bg-[#1A2235] text-slate-300 hover:bg-[#1F2943] hover:text-white hover:border-slate-700 transition-colors",
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
