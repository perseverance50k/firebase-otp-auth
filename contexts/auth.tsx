"use client";

import { auth } from "@/configs/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

type AuthContext = {
  user: User | null;
};

export const AuthContext = createContext<AuthContext>({ user: null });

export const AuthProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) =>
      setUser(user ?? null)
    );

    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
