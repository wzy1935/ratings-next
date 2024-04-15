import { currentUser, SignOutButton, UserProfile } from '@clerk/nextjs';
import { Title, Text, Divider, Button } from '@mantine/core';
import Image from 'next/image';

export default async function User() {
  const user = await currentUser();

  const primaryEmail = user?.emailAddresses?.find(item => item.id === user?.primaryEmailAddressId)?.emailAddress

  return (
    <>
      <div className=" max-w-xl mx-auto w-full pt-10">
        <div className=" flex justify-center gap-x-4 w-full">
          <div className=" h-24 shrink-0 rounded-full overflow-clip ">
            {user?.imageUrl && (
              <Image
                src={user.imageUrl}
                alt="avatar"
                width={100}
                height={100}
                className=" h-full w-full"
              />
            )}
          </div>
          <div className=' w-full'>
            <Title order={3}>{user?.username ?? '<user>'}</Title>
            <Text>{primaryEmail ?? ''}</Text>
          </div>
        </div>

        <Divider my='md'></Divider>
          <SignOutButton>
            <Button color='red'>Sign Out</Button>
          </SignOutButton>
        <div>
          
        </div>
      </div>
    </>
  );
}
