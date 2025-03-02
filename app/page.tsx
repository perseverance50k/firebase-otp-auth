"use client";

import { auth } from "@/configs/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/ui/components/Button";
import { Visible } from "@/ui/components/Visible";
import { signOut } from "firebase/auth";
import { NextPage } from "next";
import Link from "next/link";

const HomePage: NextPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Home Page</h1>

      <Visible when={Boolean(user)}>
        <h2>Welcome to the app, {user?.displayName}</h2>
      </Visible>
      <Visible when={!Boolean(user)}>
        <h2>You aren&apos;t logged in</h2>
      </Visible>

      <Visible when={Boolean(user)}>
        <Button onClick={() => signOut(auth)}>Sign out</Button>
      </Visible>
      <Visible when={!Boolean(user)}>
        <Link href="/login">
          <Button>Sign in</Button>
        </Link>
      </Visible>
    </div>
  );
};

export default HomePage;
