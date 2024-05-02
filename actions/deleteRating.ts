'use server';

import { prismaClient } from '@/utils/storage';
import { auth, clerkClient } from '@clerk/nextjs';
import checkAdmin from './checkAdmin';

export default async function deleteRating(
  ratingId: number
): Promise<'SUCCESS' | 'ERROR'> {
  const { userId: caller } = auth();
  if (caller === null) return 'ERROR';

  const ratingQuery = await prismaClient.rating.findFirst({
    where: {
      id: ratingId,
    },
  });
  if (!ratingQuery) return 'ERROR';
  if (!checkAdmin(caller) && ratingQuery.createdBy !== caller) return 'ERROR';

  await prismaClient.rating.delete({
    where: { id: ratingId },
  });
  return 'SUCCESS';
}
