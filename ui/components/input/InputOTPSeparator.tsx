import { MinusIcon } from "lucide-react";
import { ComponentProps, FC } from "react";

type Props = ComponentProps<"div">;

export const InputOTPSeparator: FC<Props> = (props) => {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
};
