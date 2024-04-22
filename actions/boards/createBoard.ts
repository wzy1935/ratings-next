'use server';

import { imageBucket, prismaClient } from '@/utils/storage';
import { v4 as uuid } from 'uuid';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';

type FormType = {
  title: string;
  description: string;
  image: string | null;
};

async function uploadImage(imageBase64: string): Promise<string> {
  let fileId = uuid();
  let file = imageBucket.file(`images/${fileId}`);
  const res = await fetch(imageBase64);
  const contentType = res.headers.get('content-type') as string;
  const buffer = Buffer.from(await res.arrayBuffer());
  file.save(buffer, { metadata: { contentType } });

  return fileId;
}

export default async function createBoard(
  form: FormType
): Promise<'SUCCESS' | 'CONFICT_NAME' | 'INVALID_FIELD' | 'ERROR'> {
  const { userId } = auth();

  if (userId === null) return 'ERROR';
  const schema = z.object({
    title: z
      .string()
      .min(2, 'Title should be at least 2 letters')
      .max(50, 'Title should be at most 50 letters'),
    description: z.string().max(500, 'Title should be at most 500 letters'),
  });
  if (!schema.safeParse(form).success) return 'INVALID_FIELD';

  const existed = await prismaClient.board.findFirst({
    where: {
      name: form.title,
    },
  });
  console.log(existed);
  if (existed) return 'CONFICT_NAME';

  let imageId: string | null = null;
  if (form.image) {
    imageId = await uploadImage(form.image);
  }

  await prismaClient.board.create({
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
