'use client';

import {
  Card,
  BackgroundImage,
  Badge,
  Text,
  NumberFormatter,
} from '@mantine/core';
import { User as UserIcon } from 'react-feather';
import { BoardDesc } from '@/actions/getBoardDesc';

function BoardItem({ board }: { board: BoardDesc }) {
  return (
    <Card shadow="sm" radius="md" padding="xs" withBorder className=" h-32 p-2">
      <Card.Section className=" h-20">
        <BackgroundImage
          className=" h-full"
          src={
            'https://storage.googleapis.com/wzy1935-ratings/images/' +
            board.imageId
          }
        >
          <div className={" h-full w-full justify-start items-end flex p-2 " + `${board.imageId ? ' ' : ' bg-gray-200'}`}>
            <Badge>
              <NumberFormatter
                value={board.overall}
                prefix="★ "
                decimalScale={1}
                fixedDecimalScale
              />
            </Badge>
          </div>
        </BackgroundImage>
      </Card.Section>
      <div>
        <Text>{board.name}</Text>
        <div className=' flex items-center gap-x-1 text-gray-500'>
          <UserIcon size={12} />
          <Text size="xs">{board.createdBy.username}</Text>
        </div>
      </div>
    </Card>
  );
}

export default BoardItem;
