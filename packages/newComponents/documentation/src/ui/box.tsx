import { ReactNode } from "react";

type BoxProps = {
  title: string;
  children: ReactNode;
};

function Box(props: BoxProps) {
  return (
    <div className="box">
      <strong>{props.title}</strong>
      {props.children}
    </div>
  );
}

export { Box };
