import { ComponentProps, FC } from "react";
import { OTPInput } from "input-otp";

import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
};

export const InputOTP: FC<Props> = (props) => {
  const { className, containerClassName, ...restProps } = props;

  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...restProps}
    />
  );
};
