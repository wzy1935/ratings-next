'use client';

import { SegmentedControl } from '@mantine/core';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export default function Segment({ type }: { type: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  function setType(type: string) {
    const params = new URLSearchParams(searchParams);
    params.set('type', type);
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <SegmentedControl
      data={['public', 'user']}
      value={type}
      onChange={setType}
    ></SegmentedControl>
  );
}
