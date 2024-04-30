import Banner from './_components/Banner';
import getBoardDesc from '@/actions/getBoardDesc';
import PaginationComponent from './_components/Pagination';
import getRatings, { Rating } from '@/actions/getRatings';
import RatingItem from './_components/RatingItem';
import UserRating from './_components/UserRating';
import { Divider, Text } from '@mantine/core';
import { prismaClient } from '@/utils/storage';
import { auth, clerkClient } from '@clerk/nextjs';

const PER_PAGE = 12;

async function getUserRating(
  userId: string,
  boardId: number
): Promise<Rating | null> {
  const query = await prismaClient.rating.findFirst({
    where: {
      boardId: boardId,
      createdBy: userId,
    },
  });
  const { userId: caller } = auth();
  if (query === null) return null;
  const { username, imageUrl } = await clerkClient.users.getUser(userId);
  const likedQuery = !caller
    ? false
    : await prismaClient.likes.findFirst({
        where: {
          userId: caller,
          ratingId: query.id,
        },
      });

  return {
    id: query.id,
    createdBy: {
      userId,
      username,
      avatarUrl: imageUrl,
    },
    content: query.comments,
    score: query.score,
    likes: query.likes,
    liked: likedQuery !== null,
  };
}

export default async function BoardItemPage({
  params,
  searchParams,
}: {
  params: {
    boardId: string;
  };
  searchParams: {
    page?: string;
  };
}) {
  const boardId = Number.parseInt(params.boardId);
  const boardDesc = await getBoardDesc(boardId);
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  if (boardDesc === null) return null;
  const { userId } = auth();

  const ratings = await getRatings(boardId, PER_PAGE * (page - 1), PER_PAGE);
  const userRating =
    userId === null ? null : await getUserRating(userId, boardId);

  return (
    <div>
      <div className="max-w-4xl mx-auto w-full gap-y-4 flex flex-col">
        <Banner boardDesc={boardDesc}></Banner>
        <UserRating rating={userRating} boardId={boardId}></UserRating>
        <Divider my="md"></Divider>

        <div>
          <Text fw={700} size="sm">
            Ratings
          </Text>
          <div className=" flex flex-col gap-y-4 mt-2">
            {ratings.map((item) => (
              <div key={item.id}>
                <RatingItem rating={item}></RatingItem>
              </div>
            ))}
          </div>
        </div>

        <div className=" flex justify-center">
          <PaginationComponent total={2} value={page}></PaginationComponent>
        </div>
      </div>
    </div>
  );
}
