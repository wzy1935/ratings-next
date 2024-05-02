'use client';

import getRatings, { Rating } from '@/actions/getRatings';
import setLike from '@/actions/setLike';
import { auth } from '@clerk/nextjs';
import deleteRating from '@/actions/deleteRating';
import n from '@/utils/notification';
import {
  Card,
  Avatar,
  Text,
  Rating as RatingComponent,
  Modal,
  Button,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { ThumbsUp as ThumbsUpIcon, Trash2 as DeleteIcon } from 'react-feather';

export default function RatingItem({ rating }: { rating: Rating }) {
  const [liked, setLiked] = useState(rating.liked);
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] =
    useDisclosure(false);
  const [deleteLoading, setdeleteLoading] = useState(false);
  const router = useRouter();

  function setLikeClick() {
    setLike(rating.id, !liked);
    setLiked(!liked);
  }

  async function handleDelete() {
    if (rating === null) return;

    setdeleteLoading(true);
    const resp = await deleteRating(rating.id);
    if (resp === 'SUCCESS') {
      n.success('Delete rating successfully.');
      deleteClose();
      router.refresh();
    } else {
      n.error('Unknown error.');
    }
    setdeleteLoading(false);
  }

  return (
    <>
      <div className="">
        <Card shadow="sm" withBorder>
          <div className=" flex gap-4">
            <div>
              <Avatar src={rating.createdBy.avatarUrl}></Avatar>
            </div>
            <div className=" w-full">
              <div className=" flex w-full items-center justify-between">
                {/* left */}
                <div className=" flex space-x-2 items-center">
                  <Text fw={700} size="sm">
                    {rating.createdBy.username}
                  </Text>
                  <RatingComponent value={rating.score} readOnly />
                </div>

                {/* right */}
                <div className=" flex space-x-2 items-center text-gray-500">
                  <Text>
                    {rating.likes - (rating.liked ? 1 : 0) + (liked ? 1 : 0)}
                  </Text>
                  <ThumbsUpIcon
                    size={16}
                    className={` cursor-pointer ${
                      liked ? ' text-[#4c6ef5]' : ' '
                    }`}
                    onClick={setLikeClick}
                  ></ThumbsUpIcon>
                  <DeleteIcon
                    onClick={deleteOpen}
                    className=" cursor-pointer"
                    size={16}
                  ></DeleteIcon>
                </div>
              </div>

              <Text>{rating.content}</Text>
            </div>
          </div>
        </Card>
      </div>
      <Modal
        opened={deleteOpened}
        onClose={deleteClose}
        centered
        title="Delete Rating"
      >
        <div className=" flex flex-col gap-y-2">
          <Text>Are you sure to delete this rating?</Text>
          <div className=" flex gap-x-2">
            <Button loading={deleteLoading} onClick={handleDelete}>
              Confirm
            </Button>
            <Button color="red" onClick={deleteClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
