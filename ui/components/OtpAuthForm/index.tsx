"use client";

import { FC } from "react";

import { useLogic } from "./useLogic";
import { FormStatus, OTP_LENGTH } from "./constants";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Input,
} from "../input";
import { Button } from "../Button";
import { Visible } from "../Visible";
import { LoadingIndicator } from "../LoadingIndicator";

export const OtpAuthForm: FC = () => {
  const {
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
  } = useLogic();

  return (
    <div className="flex flex-col justify-center items-center">
      <Visible when={!confirmationResult}>
        <form onSubmit={handleRequestOtp}>
          <Input
            className="text-black"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-2">
            Please enter your number with the country code (e.g. +1 for the US)
          </p>
        </form>
      </Visible>

      <Visible when={Boolean(confirmationResult)}>
        <InputOTP
          maxLength={OTP_LENGTH}
          value={otp}
          onChange={(value) => setOtp(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Visible>

      <Button
        disabled={isSendOtpButtonDisabled}
        onClick={() => handleRequestOtp()}
        className="mt-5"
      >
        <Visible when={formStatus === FormStatus.COOL_DOWN}>
          {`Resend in ${resendCountdown}`}
        </Visible>
        <Visible when={formStatus === FormStatus.SENDING}>
          Sending OTP...
        </Visible>
        <Visible when={formStatus === FormStatus.READY}>Send OTP</Visible>
      </Button>

      <div className="p-10 text-center">
        <Visible when={Boolean(errorMessage)}>
          <p className="text-red-500">{errorMessage}</p>
        </Visible>
        <Visible when={Boolean(successMessage)}>
          <p className="text-green-500">{successMessage}</p>
        </Visible>
      </div>

      {isPending && <LoadingIndicator />}

      <div id="recaptcha-container" />
    </div>
  );
};
