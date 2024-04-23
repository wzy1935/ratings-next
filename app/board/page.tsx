import { Title } from '@mantine/core';
import Segment from './_components/Segment';
import Pagination from './_components/Pagination';
import AddBoard from './_components/AddBoard';
import BoardItem from './_components/BoardItem';
import { auth } from '@clerk/nextjs';
import { prismaClient } from '@/utils/storage';

type BoardType = {
  id: number;
  imageId: string | null;
  createdBy: string;
  createdAt: Date;
  description: string;
  name: string;
};

const PER_PAGE = 12;

export default async function Board({
  searchParams,
}: {
  searchParams: {
    page?: number;
    type?: string;
    query?: string;
  };
}) {
  const { userId } = auth();

  const page = searchParams.page ?? 1;
  const type: 'user' | 'public' =
    searchParams.type === 'user' && userId !== null ? 'user' : 'public';
  // TODO: add query function

  let boardList: BoardType[];
  let boardCnt: number;
  if (type === 'user' && userId !== null) {
    boardCnt = await prismaClient.board.count({ where: { createdBy: userId } });
    boardList = await prismaClient.board.findMany({
      where: { createdBy: userId },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    });
  } else {
    boardCnt = await prismaClient.board.count();
    boardList = await prismaClient.board.findMany({
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    });
  }

  const pageCnt = Math.max(1, Math.ceil(boardCnt / PER_PAGE));

  return (
    <>
      <div className="max-w-4xl mx-auto w-full gap-y-4 flex flex-col">
        <div className=" flex justify-between items-center">
          <Title>Board</Title>
          <div className=" flex items-center gap-x-4">
            {userId && <AddBoard></AddBoard>}
            <Segment type={type}></Segment>
          </div>
        </div>

        <div className=" grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-4 gap-y-4">
          {boardList.map((item) => (
            <BoardItem key={item.id} board={item} />
          ))}
        </div>

        <div className=" flex justify-center">
          <Pagination value={1} total={pageCnt}></Pagination>
        </div>
      </div>
    </>
  );
}
