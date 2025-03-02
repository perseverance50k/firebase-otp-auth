import { ComponentProps, FC } from "react";

import { cn } from "@/lib/utils";

type Props = ComponentProps<"div">;

export const InputOTPGroup: FC<Props> = (props) => {
  const { className, ...restProps } = props;

  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...restProps}
    />
  );
};
