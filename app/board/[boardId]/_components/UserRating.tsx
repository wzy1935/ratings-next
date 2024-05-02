'use client';

import {
  Textarea,
  Button,
  Text,
  Modal,
  Rating as RatingComponent,
} from '@mantine/core';
import { Rating } from '@/actions/getRatings';
import { useState } from 'react';
import RatingItem from './RatingItem';
import setRating from '@/actions/setRating';
import { z } from 'zod';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import n from '@/utils/notification';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import deleteRating from '@/actions/deleteRating';

export default function UserRating({
  rating,
  boardId,
}: {
  rating: Rating | null;
  boardId: number;
}) {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setdeleteLoading] = useState(false);
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] =
    useDisclosure(false);
  const router = useRouter();

  const schema = z.object({
    content: z.string().max(500, 'Comment should be at most 500 letters'),
    score: z
      .number()
      .gte(1, 'Rating must be over 1')
      .lte(5, 'Rating must be less than 5'),
  });
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { content: '', score: 5 },
    validate: zodResolver(schema),
  });
  function formPropWithoutKey(propName: string) {
    const { key, ...rest } = form.getInputProps(propName) as any;
    return { ...rest };
  }

  async function handleSubmit(formData: { content: string; score: number }) {
    setLoading(true);
    const resp = await setRating(boardId, formData.content, formData.score);
    if (resp == 'SUCCESS') {
      setEdit(false);
      n.success('Submit rating successful.');
      router.refresh();
    } else {
      n.error('Unknown error');
    }
    setLoading(false);
  }
  function reset() {
    form.reset();
    setEdit(false);
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

  let display;
  if (rating === null) {
    display = <Text>You haven&apos;t rated it yet</Text>;
  } else {
    display = (
      <div>
        <RatingComponent value={rating.score} readOnly />
        <Text>{rating.content}</Text>
      </div>
    );
  }
  return (
    <div className=" flex flex-col gap-y-2">
      <div className=" flex space-x-2 items-center">
        <Text fw={700} size="sm">
          My Rating
        </Text>
      </div>
      {edit ? (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <div>
            <RatingComponent
              className=" mb-2"
              {...formPropWithoutKey('score')}
            />
            <Textarea {...formPropWithoutKey('content')}></Textarea>
          </div>
          <div className=" flex space-x-2  mt-2">
            <Button type="submit" loading={loading}>
              Submit
            </Button>
            <Button onClick={reset}>Cancel</Button>
          </div>
        </form>
      ) : (
        <>
          {display}
          <div className=" flex space-x-2 mt-2">
            <Button onClick={() => setEdit(true)}>
              {rating ? 'Update' : 'Rate'}
            </Button>
            {rating && <Button color="red" onClick={deleteOpen}>
              Delete
            </Button>}
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
          </div>
        </>
      )}
    </div>
  );
}
