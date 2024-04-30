import { Title } from '@mantine/core';
import Segment from './_components/Segment';
import Pagination from './_components/Pagination';
import AddBoard from './_components/AddBoard';
import BoardItem from './_components/BoardItem';
import { auth } from '@clerk/nextjs';
import { prismaClient } from '@/utils/storage';
import getBoardDesc, { BoardDesc } from '@/actions/getBoardDesc';
import Link from 'next/link';

const PER_PAGE = 24;

export default async function Board({
  searchParams,
}: {
  searchParams: {
    page?: string;
    type?: string;
    query?: string;
  };
}) {
  const { userId } = auth();

  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  const type: 'user' | 'public' =
    searchParams.type === 'user' && userId !== null ? 'user' : 'public';
  // TODO: add query function

  let boardIds: number[];
  let boardList: BoardDesc[];
  let boardCnt: number;
  if (type === 'user' && userId !== null) {
    boardCnt = await prismaClient.board.count({ where: { createdBy: userId } });
    boardIds = (
      await prismaClient.board.findMany({
        where: { createdBy: userId },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
      })
    ).map((item) => item.id);
  } else {
    boardCnt = await prismaClient.board.count();
    boardIds = (
      await prismaClient.board.findMany({
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
      })
    ).map((item) => item.id);
  }
  boardList = (await Promise.all(
    boardIds.map(async (item) => await getBoardDesc(item))
  )) as BoardDesc[];
  const pageCnt = Math.max(1, Math.ceil(boardCnt / PER_PAGE));

  return (
    <>
      <div className="max-w-4xl mx-auto w-full gap-y-4 flex flex-col">
        <div className=" flex justify-between items-center">
          <Title>Board</Title>
          <div className=" flex items-center gap-x-4">
            {userId && <AddBoard></AddBoard>}
            {userId && <Segment type={type}></Segment>}
          </div>
        </div>

        <div className=" grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-4 gap-y-4">
          {boardList.map((item) => (
            <Link key={item.id} href={'/board/' + item.id}>
              <BoardItem board={item} />
            </Link>
          ))}
        </div>

        <div className=" flex justify-center">
          <Pagination value={page} total={pageCnt}></Pagination>
        </div>
      </div>
    </>
  );
}
