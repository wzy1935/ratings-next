'use client';

import { Pagination } from '@mantine/core';

export default function PaginationComponent({total, value}: {
  total: number,
  value: number
}) {
  return <Pagination total={total} value={value} withControls={false}/>
}