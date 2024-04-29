'use client';

import { BoardDesc } from '@/actions/boards/getBoardDesc';
import { Rating, Progress, Text, Title, NumberFormatter, Spoiler } from '@mantine/core';
import _ from 'lodash';

function RatingDisplay({
  overall,
  scores,
}: {
  overall: number;
  scores: number[];
}) {
  const sum = _.sum(scores);
  return (
    <div className=" flex gap-4">
      <div className=" w-28">
        <p className=" text-5xl text-center">
          <NumberFormatter value={overall} decimalScale={1} fixedDecimalScale />
        </p>
        <Text size="sm" className=' text-center'>
          {sum} {sum > 1 ? 'users' : 'user'} rated
        </Text>
      </div>
      <div>
        {_.reverse(scores).map((item, i) => (
          <div key={i} className=" flex w-64 items-center space-x-2">
            <Rating value={5 - i} readOnly></Rating>
            <Progress value={(item / sum) * 100} className=" w-full"></Progress>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Banner({ boardDesc }: { boardDesc: BoardDesc }) {
  return (
    <>
    <Title order={2}>{boardDesc.name}</Title>
    <div className=" flex flex-col-reverse items-center gap-y-4 md:flex-row md:items-start">
      <Spoiler maxHeight={80} showLabel="Show more" hideLabel="Hide">
        <Text>{boardDesc.description}</Text>
      </Spoiler>

      <RatingDisplay
        overall={boardDesc.overall}
        scores={boardDesc.scores}
      ></RatingDisplay>
    </div>
    </>
  );
}
