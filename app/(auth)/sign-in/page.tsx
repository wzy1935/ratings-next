
import { Card, Text, Title } from "@mantine/core";
import { SignIn, SignUp } from "@clerk/nextjs";

export default function Auth() {
  return (
    <>
      <div className=" pt-20 flex justify-center">
        <SignIn signUpUrl="/sign-up" redirectUrl='/'></SignIn>
      </div>
    </>
  );
}
