import { FormEvent, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import {
  AuthErrorCodes,
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "@/configs/firebase";

import { FormStatus, ONE_MINUTE, OTP_LENGTH } from "./constants";

const getFormStatus = (resendCountdown: number, isPending: boolean) => {
  if (resendCountdown > 0) {
    return FormStatus.COOL_DOWN;
  }

  if (isPending) {
    return FormStatus.SENDING;
  }

  return FormStatus.READY;
};

export const useLogic = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );

    setRecaptchaVerifier(recaptchaVerifier);

    return () => {
      recaptchaVerifier.clear();
    };
  }, [auth]);

  useEffect(() => {
    const isEntireOtpEntered = otp.length === OTP_LENGTH;

    if (isEntireOtpEntered) {
      verifyOtp();
    }
  }, [otp]);

  const verifyOtp = async () => {
    setSuccessMessage(null);

    startTransition(async () => {
      if (!confirmationResult) {
        return setErrorMessage("Please, request an OTP first.");
      }

      setErrorMessage(null);

      try {
        await confirmationResult.confirm(otp);
        router.replace("/");
      } catch (error) {
        console.error("Error occurred while verifying OTP:", error);

        setErrorMessage(
          "Failed to verify OTP. Please, try again or contact support."
        );
      }
    });
  };

  /**
   * The "event" parameter is optional because it won't be present
   * if this handler is triggered using a button instead of a form.
   */
  const handleRequestOtp = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    setResendCountdown(ONE_MINUTE);

    startTransition(async () => {
      if (!recaptchaVerifier) {
        return setErrorMessage("RecaptchaVerifier is not initialized.");
      }

      setErrorMessage(null);

      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifier
        );

        setConfirmationResult(confirmationResult);
        setSuccessMessage("OTP has been sent successfully.");
      } catch (error: unknown) {
        console.error("Error occurred while requesting an OTP:", error);
        setResendCountdown(0);

        if (error instanceof FirebaseError) {
          switch (error.code) {
            case AuthErrorCodes.INVALID_PHONE_NUMBER: {
              setErrorMessage(
                "Invalid phone number. Please, check the number."
              );
              break;
            }
            case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER: {
              setErrorMessage("Too many requests. Please, try again later.");
              break;
            }
            default: {
              setErrorMessage("Failed to send an OTP. Please, try again.");
            }
          }
        }
      }
    });
  };

  const isSendOtpButtonDisabled =
    !phoneNumber || isPending || resendCountdown > 0;

  const formStatus = getFormStatus(resendCountdown, isPending);

  return {
    confirmationResult,
    handleRequestOtp,
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    resendCountdown,
    isSendOtpButtonDisabled,
    formStatus,
    isPending,
    errorMessage,
    successMessage,
  };
};
