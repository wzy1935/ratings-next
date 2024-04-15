
import { Card, Text, Title } from "@mantine/core";
import { SignIn, SignUp } from "@clerk/nextjs";

export default function Auth() {
  return (
    <>
      <div className=" pt-20 flex justify-center">
        <SignUp signInUrl="/sign-in" redirectUrl='/'></SignUp>
      </div>
    </>
  );
}
