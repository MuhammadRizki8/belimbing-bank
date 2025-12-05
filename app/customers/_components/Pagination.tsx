'use client';

import React, { useMemo } from 'react';
import { Pagination as UiPagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';

type Props = {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
};

export default function Pagination({ total, page, pageSize, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pages = useMemo(() => {
    const list: number[] = [];
    for (let i = 1; i <= totalPages; i++) list.push(i);
    return list;
  }, [totalPages]);

  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <UiPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={page > 1 ? prev : undefined} className={page <= 1 ? 'opacity-50 pointer-events-none' : ''} />
        </PaginationItem>

        {pages.length > 7 ? (
          // basic truncation logic: show first, ellipsis, middle pages, ellipsis, last
          <>
            <PaginationItem>
              <PaginationLink isActive={1 === page} onClick={() => onPageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            {page > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {pages
              .filter((p) => Math.abs(p - page) <= 2 && p !== 1 && p !== totalPages)
              .map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink isActive={p === page} onClick={() => onPageChange(p)}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

            {page < totalPages - 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink isActive={totalPages === page} onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        ) : (
          pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink isActive={p === page} onClick={() => onPageChange(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))
        )}

        <PaginationItem>
          <PaginationNext onClick={page < totalPages ? next : undefined} className={page >= totalPages ? 'opacity-50 pointer-events-none' : ''} />
        </PaginationItem>
      </PaginationContent>
    </UiPagination>
  );
}
