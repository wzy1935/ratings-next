'use client';

import { BoardDesc } from '@/actions/getBoardDesc';
import {
  Button,
  Rating,
  Progress,
  Text,
  Title,
  NumberFormatter,
  Spoiler,
} from '@mantine/core';
import _ from 'lodash';
import EditBoard from './EditBoard';
import DeleteBoard from './DeleteBoard';

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
        <Text size="sm" className=" text-center">
          {sum} {sum > 1 ? 'users' : 'user'} rated
        </Text>
      </div>
      <div>
        {scores
          .slice()
          .reverse()
          .map((item, i) => (
            <div key={i} className=" flex w-48 md:w-64 items-center space-x-2">
              <Rating value={5 - i} readOnly></Rating>
              <Progress
                value={(item / sum) * 100}
                className=" w-full"
              ></Progress>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function Banner({ boardDesc }: { boardDesc: BoardDesc }) {
  const initForm = {title: boardDesc.name, description: boardDesc.description, image: null};

  return (
    <>
      <div className=" flex justify-between items-center">
        <Title order={2}>{boardDesc.name}</Title>
        <div>
          <EditBoard initForm={initForm} imageId={boardDesc.imageId} boardId={boardDesc.id}/>
          <DeleteBoard boardId={boardDesc.id}></DeleteBoard>
        </div>
      </div>

      <div className=" flex flex-col-reverse items-center gap-y-4 md:flex-row md:items-start">
        <div className=" w-full">
          <Spoiler maxHeight={80} showLabel="Show more" hideLabel="Hide">
            <Text>{boardDesc.description}</Text>
          </Spoiler>
        </div>

        <RatingDisplay
          overall={boardDesc.overall}
          scores={boardDesc.scores}
        ></RatingDisplay>
      </div>
    </>
  );
}
