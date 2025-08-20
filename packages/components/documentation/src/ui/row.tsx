import { ReactNode } from "react";

type RowProps = {
  children: ReactNode;
};

function Row(props: RowProps) {
  return <div className="row">{props.children}</div>;
}

export { Row };
