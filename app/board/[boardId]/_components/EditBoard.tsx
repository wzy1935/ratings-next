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
import editBoard from '@/actions/editBoard';
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

export type FormType = {
  title: string;
  description: string;
  image: File | null;
};

export default function EditBoard({
  initForm,
  imageId,
  boardId,
}: {
  initForm: FormType;
  imageId: string | null;
  boardId: number;
}) {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [fileURL, setFileURL] = useState<string | null>(
    imageId
      ? 'https://storage.googleapis.com/wzy1935-ratings/images/' + imageId
      : null
  );
  const [imageChanged, setImageChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialValues: FormType = initForm;
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
    setImageChanged(true);
    if (file === null) {
      setFileURL(null);
    } else {
      setFileURL(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(formData: FormType) {
    setLoading(true);
    const returnCode = await editBoard(
      {
        ...formData,
        image: await toBase64(formData.image),
      },
      boardId,
      imageChanged
    );
    if (returnCode === 'SUCCESS') {
      resetAndClose();
      n.success('Updated board successfully.');
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
    setFileURL(
      imageId
        ? 'https://storage.googleapis.com/wzy1935-ratings/images/' + imageId
        : null
    );
    close();
  }

  return (
    <>
      <Button onClick={open} variant="subtle">
        Edit
      </Button>
      <Modal
        opened={opened}
        onClose={resetAndClose}
        title={'Edit Board'}
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
                Edit
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
