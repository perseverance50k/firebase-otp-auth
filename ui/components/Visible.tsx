import { FC, PropsWithChildren } from "react";

type Props = {
  when: boolean;
} & PropsWithChildren;

export const Visible: FC<Props> = (props) => {
  const { when, children } = props;

  if (!when) {
    return null;
  }

  return children;
};
