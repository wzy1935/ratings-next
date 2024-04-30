'use server';

import { prismaClient } from '@/utils/storage';
import { auth } from '@clerk/nextjs';
import checkAdmin from './checkAdmin';

export default async function setRating(
  boardId: number,
  content: string,
  score: number
): Promise<'SUCCESS' | 'ERROR'> {
  const { userId } = auth();
  if (userId === null) return 'ERROR';
  const existQuery = await prismaClient.rating.findFirst({
    where: { createdBy: userId, boardId: boardId },
  });

  if (existQuery) {
    await prismaClient.rating.update({
      where: { id: existQuery.id },
      data: {
        score: score,
        comments: content,
      },
    });
  } else {
    await prismaClient.rating.create({
      data: {
        score: score,
        likes: 0,
        comments: content,
        boardId: boardId,
        createdBy: userId,
        createdAt: new Date(),
      },
    });
  }
  return 'SUCCESS';
}
