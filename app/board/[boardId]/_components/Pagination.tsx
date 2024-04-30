'use client';

import { Pagination } from '@mantine/core';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export default function PaginationComponent({total, value}: {
  total: number,
  value: number
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  function setPage(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  return <Pagination total={total} value={value} onChange={setPage} withControls={false}/>
}