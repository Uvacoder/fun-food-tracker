import { useState, useEffect, createContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as authSignOut,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { firebaseConfig } from "./firebase-config";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// subscribe to auth changes
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  // useEffect with no dependencies: run on component mount
  // info: https://react.dev/reference/react/useEffect

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("rerunning auth listener");
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        // could redirect to login here
        // or nextjs route guards
      }
    });
    // cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // todo: return a setter function to manually set on change
  // does not run automatically on auth data change, just on auth state (login / logout)
  return [user, setUser] as const;
};

export const signUp = (email: string, password: string) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      console.log("user signed up", userCredential.user);
    })
    .catch((error) => {
      console.error("error signing up - code:", error.code);
      console.error("error signing up - message:", error.message);
    });
};

export const signIn = (email: string, password: string) => {
  console.log("attempting signin");
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      console.log("signed in", userCredential.user);
    })
    .catch((error) => {
      console.error("error signing in -- code:", error.code);
      console.error("error signing in -- message:", error.message);
    });
};

export const signOut = () => {
  authSignOut(auth)
    .then(() => {
      // Signed out
      console.log("signed out");
    })
    .catch((error) => {
      console.error("error signing out", error);
    });
};

export const updateAuthProfile = (profile: UserProfile) => {
  if (auth.currentUser) {
    updateProfile(auth.currentUser, {
      ...profile,
    })
      .then(() => {
        console.log("profile updated");
      })
      .catch((error) => {
        console.error("error updating user profile", error);
      });
  } else {
    console.error("couldn't update user profile (no user found)");
  }
};

export const updateAuthEmail = (email: string) => {
  if (auth.currentUser) {
    updateEmail(auth.currentUser, email)
      .then(() => {
        console.log("email updated");
      })
      .catch((error) => {
        console.error("error updating user email", error);
      });
  } else {
    console.error("couldn't update user email (no user found)");
  }
};
