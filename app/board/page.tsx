import { Title } from '@mantine/core';
import Segment from './_components/Segment';
import Pagination from './_components/Pagination';
import AddBoard from './_components/AddBoard';
import { auth } from '@clerk/nextjs';

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
  const type = searchParams.type ?? 'public';
  const query = searchParams.query ?? '';

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

        <div className=" grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-4 gap-y-4"></div>

        <div className=" flex justify-center">
          <Pagination value={1} total={10}></Pagination>
        </div>
      </div>
    </>
  );
}
