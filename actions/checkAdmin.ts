'use server';

import {prismaClient} from '@/utils/storage'

export default async function checkAdmin(userId: string): Promise<boolean> {
  const found = await prismaClient.admin.findFirst({where: {userId: userId}});
  return found !== null;
}