import { NextPage } from "next";

import { OtpAuthForm } from "@/ui/components/OtpAuthForm";

const LoginPage: NextPage = () => {
  return (
    <main>
      <h1>Login</h1>
      <OtpAuthForm />
    </main>
  );
};

export default LoginPage;
