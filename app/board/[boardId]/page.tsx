import Banner from './_components/Banner';
import getBoardDesc from '@/actions/boards/getBoardDesc';

export default async function BoardItemPage({
  params,
}: {
  params: {
    boardId: string;
  };
}) {
  const boardId = Number.parseInt(params.boardId);
  const boardDesc = await getBoardDesc(boardId);
  if (boardDesc === null) return null;

  return (
    <div>
      <div className="max-w-4xl mx-auto w-full gap-y-4 flex flex-col">
        <Banner boardDesc={boardDesc}></Banner>
      </div>
    </div>
  );
}
