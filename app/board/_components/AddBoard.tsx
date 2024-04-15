'use client';

import {
  Button,
  Modal,
  Title,
  TextInput,
  Textarea,
  FileInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function AddBoard() {
  const [opened, { open, close }] = useDisclosure(false);

  const title = <Title order={2}>Add Board</Title>;

  return (
    <>
      <Button onClick={open}>Create</Button>
      <Modal opened={opened} onClose={close} title={title} centered>
        <div className=" flex flex-col gap-y-2">
          <TextInput label="Title"></TextInput>
          <Textarea label="Description" rows={4}></Textarea>
          <FileInput
            label="Cover Image"
            accept="image/png,image/jpeg"
          ></FileInput>
          <div className=" h-32 bg-gray-50 flex justify-center items-center">
            Image Preview
          </div>

          <div className=' flex gap-x-2'>
            <Button>Create</Button>
            <Button color='red'>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
