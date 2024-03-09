import { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, getAuthErrorFromCode } from "@/utils/firebase-auth";
import Button from "@/components/Button";
import Link from "@/components/Link";
import { useRouter } from "next/navigation";

// todo: persist email between sign up / sign in / forgot password
export default function SignInForm() {
  const formDefaults = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(formDefaults);
  const router = useRouter();

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  return (
    <>
      {statusMessage && (
        <p className="py-2 mb-4 bg-b-high px-4 rounded-md text-sm">
          {statusMessage}
        </p>
      )}
      <form
        className="flex flex-col max-w-full gap-2 mb-16"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("signing in...");
          signInWithEmailAndPassword(auth, formData.email, formData.password)
            .then(() => {
              // signed in
              // router will push to "/user"
            })
            .catch((error) => {
              setStatusMessage(`Error: ${getAuthErrorFromCode(error.code)}`);
            });
        }}
      >
        <label className="w-full mb-4">
          <h3 className="font-semibold tracking-tighter text-sm mb-2">Email</h3>
          <input
            className="w-full bg-b-low text-f-high text-sm p-2 border-2 border-border rounded-lg hover:border-f-low focus:border-f-low placeholder:text-f-low"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChangeInput}
          ></input>
        </label>
        <label className="w-full mb-6">
          <h3 className="font-semibold tracking-tighter text-sm mb-2">
            Password
          </h3>
          <input
            className="w-full bg-b-low text-f-high text-sm p-2 border-2 border-border rounded-lg hover:border-f-low focus:border-f-low placeholder:text-f-low"
            name="password"
            type="password"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChangeInput}
          ></input>
        </label>
        <Button type="submit">Sign in</Button>
      </form>
      <div className="text-sm mb-2">
        New here? &nbsp;
        <Link href="/signup">Sign up</Link>
      </div>
      <div className="text-sm">
        Forgot password? &nbsp;
        <Link href="/forgot-password">Reset password</Link>
      </div>
    </>
  );
}
