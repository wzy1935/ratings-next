import Icon from './Icon';
import Link from 'next/link';
import { Button } from '@mantine/core';
import { auth } from '@clerk/nextjs';

export default async function Header() {
  const {userId} = await auth();

  return (
    <>
      <header className=" border cursor-default flex p-2 md:px-20 items-center gap-x-2">
        <Icon></Icon>
        <Link href="/board">
          <Button variant="subtle">Board</Button>
        </Link>
        {userId !== null && <Link href="/user">
          <Button variant="subtle">User</Button>
        </Link>}
        {userId === null && <Link href="/sign-in">
          <Button variant="subtle">Sign In</Button>
        </Link>}
        {userId === null && <Link href="/sign-up">
          <Button variant="subtle">Sign Up</Button>
        </Link>}
      </header>
    </>
  );
}
