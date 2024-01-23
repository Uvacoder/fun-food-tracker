"use client";

import { useContext } from "react";
import { signOut } from "@/utils/firebase-auth";
import { UserContext } from "../../components/UserProvider";
import Button from "../../components/Button";
import UpdateUserForm from "./UpdateUserForm";
import { useRouter } from "next/navigation";
import { useTheme } from "@/utils/useTheme";
import Listbox from "@/components/Listbox";

export default function User() {
  const { user, isLoading } = useContext(UserContext);
  const router = useRouter();
  const { theme, themeVariant, updateTheme, toggleMode } = useTheme({});
  const themeVariants = ["modern", "natural"];
  if (!isLoading) {
    return user ? (
      <>
        <div className="flex flex-col items-center mb-16">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={`profile image for ${user.displayName}`}
              className="rounded-full w-20 h-20 mb-4 object-cover shadow-inner"
            />
          )}
          <h2 className="font-bold text-lg">{user.displayName}</h2>
        </div>
        <h3 className="font-bold text-lg mb-8">Update profile</h3>
        <div className="mb-8">
          <UpdateUserForm />
        </div>
        <h3 className="font-bold text-lg mb-4">Update theme</h3>
        <div className="mb-8">
          <Listbox
            title="variant"
            value={themeVariant}
            onChange={(e) => updateTheme({ newThemeVariant: e })}
            options={themeVariants}
          ></Listbox>
        </div>
        <h3 className="font-bold text-lg mb-4">Sign out</h3>
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    ) : (
      router.push("/signin")
    );
  }
}
