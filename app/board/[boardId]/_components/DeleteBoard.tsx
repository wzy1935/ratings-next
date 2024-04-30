'use client';

import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Text } from '@mantine/core';
import { useState } from 'react';
import deleteBoard from '@/actions/deleteBoard';
import n from '@/utils/notification';
import { useRouter } from 'next/navigation';

export default function DeleteBoard({ boardId }: { boardId: number }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function deleteClick() {
    setLoading(true);
    const resp = await deleteBoard(boardId);
    if (resp === 'SUCCESS') {
      n.success('Delete successful.');
      router.replace('/board');
      router.refresh();
    } else {
      n.error('Unknown error.');
    }
    setLoading(false);
  }

  return (
    <>
      <Button onClick={open} variant="subtle" color="red">
        Delete
      </Button>
      <Modal opened={opened} title={'Delete Board'} onClose={close} centered>
        <div className=" flex flex-col gap-y-2">
          <Text>Are you sure to delete this board?</Text>
          <div className=" flex gap-x-2">
            <Button loading={loading} onClick={deleteClick}>
              Confirm
            </Button>
            <Button color="red" onClick={close}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
