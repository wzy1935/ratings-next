'use client';

import {
  Card,
  BackgroundImage,
  Badge,
  Text,
  NumberFormatter,
} from '@mantine/core';
import { BoardDesc } from '@/actions/boards/getBoardDesc';

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
          <div className=" h-full w-full justify-start items-end flex p-2">
            <Badge>
              <NumberFormatter value={board.overall} prefix='★ ' decimalScale={1} fixedDecimalScale/>
            </Badge>
          </div>
        </BackgroundImage>
      </Card.Section>
      <div>
        <Text fw={700}>{board.name}</Text>
        {/* <Text>{board.description}</Text> */}
      </div>
    </Card>
  );
}

export default BoardItem;
