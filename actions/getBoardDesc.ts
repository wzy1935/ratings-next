'use server';

import { prismaClient } from '@/utils/storage';
import { clerkClient } from '@clerk/nextjs';
import _ from 'lodash';

export type BoardDesc = {
  id: number;
  overall: number;
  scores: number[];
  name: string;
  description: string;
  imageId: string | null;
  createdBy: {
    userId: string;
    username: string | null;
    avatarUrl: string;
  };
  createAt: Date;
};

export default async function getBoardDesc(
  boardId: number
): Promise<BoardDesc | null> {
  const board = await prismaClient.board.findFirst({ where: { id: boardId } });
  if (board === null) return null;

  const scoresQuery = await prismaClient.rating.groupBy({
    by: ['score'],
    where: { boardId: boardId },
    _count: {
      score: true,
    },
  });
  const scoresCnt = [0, 0, 0, 0, 0];
  for (let i = 0; i < 5; i++) {
    const item = scoresQuery.find((item) => item.score === i + 1);
    if (item) {
      scoresCnt[i] = item._count.score;
    }
  }
  const scoreSum =
    scoresCnt[0] * 1 +
    scoresCnt[1] * 2 +
    scoresCnt[2] * 3 +
    scoresCnt[3] * 4 +
    scoresCnt[4] * 5;
  const overall =
    _.sum(scoresCnt) === 0
      ? 0
      : Math.round((scoreSum * 10) / _.sum(scoresCnt)) / 10;
  const user = await clerkClient.users.getUser(board.createdBy);

  return {
    id: boardId,
    overall: overall,
    scores: scoresCnt,
    name: board.name,
    description: board.description,
    imageId: board.imageId,
    createdBy: {
      userId: user.id,
      username: user.username,
      avatarUrl: user.imageUrl,
    },
    createAt: board.createdAt,
  };
}
