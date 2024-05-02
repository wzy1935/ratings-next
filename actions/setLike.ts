'use server';

import { prismaClient } from '@/utils/storage';
import { auth } from '@clerk/nextjs';

export default async function setLike(
  ratingId: number,
  like: boolean
): Promise<'SUCCESS' | 'ERROR'> {
  const { userId } = auth();
  if (userId === null) return 'ERROR';

  const ratingQuery = await prismaClient.rating.findFirst({
    where: { id: ratingId },
  });
  if (!ratingQuery) return 'ERROR';
  const likeQuery = await prismaClient.likes.findFirst({
    where: { userId: userId, ratingId: ratingId },
  });

  if (like && !likeQuery) {
    // add record
    await prismaClient.likes.create({
      data: {
        userId: userId,
        ratingId: ratingId,
      },
    });
  } else if (!like && likeQuery) {
    // delete record
    await prismaClient.likes.delete({
      where: { id: likeQuery.id },
    });
  }

  return 'SUCCESS';
}
