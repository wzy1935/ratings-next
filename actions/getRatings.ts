'use server';

import { prismaClient } from '@/utils/storage';
import { auth, clerkClient } from '@clerk/nextjs';

export type Rating = {
  id: number;
  createdBy: {
    userId: string;
    username: string | null;
    avatarUrl: string;
  };
  content: string;
  score: number;
  likes: number;
  liked: boolean;
};

export default async function getRatings(
  boardId: number,
  skip: number,
  take: number
): Promise<Rating[]> {
  const { userId: caller } = auth();
  const ratingsQuery = await prismaClient.rating.findMany({
    where: {
      boardId: boardId,
    },
    skip: skip,
    take: take,
  });
  return await Promise.all(
    ratingsQuery.map(async (item) => {
      const userId = item.createdBy;
      const { username, imageUrl } = await clerkClient.users.getUser(userId);
      const likedQuery = !caller
        ? false
        : await prismaClient.likes.findFirst({
            where: {
              userId: caller,
              ratingId: item.id,
            },
          });

      return {
        id: item.id,
        createdBy: {
          userId,
          username,
          avatarUrl: imageUrl,
        },
        content: item.comments,
        score: item.score,
        likes: item.likes,
        liked: likedQuery !== null,
      };
    })
  );
}
