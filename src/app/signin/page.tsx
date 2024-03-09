"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/components/UserProvider";
import SignInForm from "./SignInForm";

export default function SignIn() {
  const { user, isLoading } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/user");
    }
  }, [user]);

  if (!isLoading && !user) {
    return (
      <>
        <h2 className="font-semibold tracking-tighter text-lg mb-4">
          You&apos;re not signed in.
        </h2>
        <p className="mb-8">
          Sign in to save your daily progress and settings.
        </p>
        <SignInForm />
      </>
    );
  }
}
