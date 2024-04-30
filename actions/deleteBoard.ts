'use server';

import { imageBucket, prismaClient } from '@/utils/storage';
import { auth } from '@clerk/nextjs';
import checkAdmin from './checkAdmin';

async function deleteImage(imageId: string | null) {
  if (imageId) {
    let file = imageBucket.file(`images/${imageId}`);
    file.delete();
  }
}

export default async function deleteBoard(
  boardId: number
): Promise<'SUCCESS' | 'ERROR'> {
  const { userId } = auth();

  const oldObj = await prismaClient.board.findFirst({ where: { id: boardId } });
  if (userId == null || (oldObj?.createdBy !== userId && !checkAdmin(userId)))
    return 'ERROR';
  deleteImage(oldObj?.imageId ?? null);

  await prismaClient.board.delete({
    where: { id: boardId },
  });
  return 'SUCCESS';
}
