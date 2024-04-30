'use server';

import { imageBucket, prismaClient } from '@/utils/storage';
import { v4 as uuid } from 'uuid';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';
import checkAdmin from './checkAdmin';

type FormType = {
  title: string;
  description: string;
  image: string | null;
};

async function changeImage(
  oldImageId: string | null,
  imageBase64: string | null
): Promise<string | null> {
  let newFileId = uuid();
  if (oldImageId) {
    let file = imageBucket.file(`images/${oldImageId}`);
    file.delete();
  }
  if (!imageBase64) return null;

  let file = imageBucket.file(`images/${newFileId}`);
  const res = await fetch(imageBase64);
  const contentType = res.headers.get('content-type') as string;
  const buffer = Buffer.from(await res.arrayBuffer());
  file.save(buffer, { metadata: { contentType } });

  return newFileId;
}

export default async function editBoard(
  form: FormType,
  boardId: number,
  imageChanged: boolean
): Promise<'SUCCESS' | 'CONFICT_NAME' | 'INVALID_FIELD' | 'ERROR'> {
  const { userId } = auth();

  const schema = z.object({
    title: z
      .string()
      .min(2, 'Title should be at least 2 letters')
      .max(50, 'Title should be at most 50 letters'),
    description: z.string().max(500, 'Title should be at most 500 letters'),
  });
  if (!schema.safeParse(form).success) return 'INVALID_FIELD';

  const oldObj = await prismaClient.board.findFirst({ where: { id: boardId } });
  const existed = await prismaClient.board.findFirst({
    where: {
      name: form.title,
    },
  });
  if (userId == null || (oldObj?.createdBy !== userId && !checkAdmin(userId)))
    return 'ERROR';
  if (oldObj?.name !== form.title && existed) return 'CONFICT_NAME';

  let imageId: string | null = oldObj?.imageId ?? null;
  if (imageChanged) {
    imageId = await changeImage(imageId, form.image);
  }

  await prismaClient.board.update({
    where: { id: boardId },
    data: {
      imageId: imageId,
      createdBy: userId,
      createdAt: new Date(),
      description: form.description,
      name: form.title,
    },
  });
  return 'SUCCESS';
}
