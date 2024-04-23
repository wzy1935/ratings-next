'use client';

import {
  Button,
  Modal,
  TextInput,
  Textarea,
  FileInput,
  Image,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zodResolver } from 'mantine-form-zod-resolver';
import createBoard from '@/actions/boards/createBoard';
import n from '@/utils/notification';
import { useRouter } from 'next/navigation';

function toBase64(file: File | null) {
  return new Promise<string | null>((resolve, reject) => {
    if (file === null) {
      resolve(null);
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    }
  });
}

type FormType = {
  title: string;
  description: string;
  image: File | null;
};

export default function AddBoard() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [fileURL, setFileURL] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const initialValues: FormType = {
    title: '',
    description: '',
    image: null,
  };
  const schema = z.object({
    title: z
      .string()
      .min(2, 'Title should be at least 2 letters')
      .max(50, 'Title should be at most 50 letters'),
    description: z.string().max(500, 'Title should be at most 500 letters'),
    image: z
      .any()
      .refine(
        (f) => (f === null ? true : f?.size <= 5000000),
        'Max image size is 5MB'
      ),
  });
  const form = useForm({
    mode: 'uncontrolled',
    initialValues,
    validate: zodResolver(schema),
  });

  function formPropWithoutKey(propName: string) {
    const { key, ...rest } = form.getInputProps(propName) as any;
    return { ...rest };
  }

  function setPic(file: File | null) {
    form.setValues({ image: file });
    if (file === null) {
      setFileURL(null);
    } else {
      setFileURL(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(formData: FormType) {
    setLoading(true);
    const returnCode = await createBoard({
      ...formData,
      image: await toBase64(formData.image),
    });
    if (returnCode === 'SUCCESS') {
      resetAndClose();
      n.success('Added board successfully.');
      router.refresh();
    } else {
      n.error(
        {
          CONFICT_NAME: 'The board with the same name already exists.',
          INVALID_FIELD: 'Input is invalid.',
          ERROR: 'Unknown error.',
        }[returnCode]
      );
    }
    setLoading(false);
  }

  function resetAndClose() {
    form.reset();
    setFileURL(null);
    close();
  }

  return (
    <>
      <Button onClick={open}>Create</Button>
      <Modal
        opened={opened}
        onClose={resetAndClose}
        title={'Add Board'}
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <div className=" flex flex-col gap-y-2">
            <TextInput
              label="Title"
              placeholder="2-50 characters"
              {...formPropWithoutKey('title')}
            ></TextInput>
            <Textarea
              label="Description"
              placeholder="No longer than 500 characters"
              rows={4}
              {...formPropWithoutKey('description')}
            ></Textarea>
            <FileInput
              label="Cover Image"
              accept="image/png,image/jpeg"
              placeholder="Accepts images <5MB"
              {...formPropWithoutKey('image')}
              onChange={setPic}
            ></FileInput>
            <div className=" h-32 bg-gray-50 flex justify-center items-center overflow-clip">
              {fileURL ? (
                <Image src={fileURL} alt="Image Preview"></Image>
              ) : (
                'Image Preview'
              )}
            </div>

            <div className=" flex gap-x-2">
              <Button type="submit" loading={loading}>
                Create
              </Button>
              <Button color="red" onClick={resetAndClose}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
