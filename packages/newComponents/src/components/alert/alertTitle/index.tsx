import { HTMLAttributes } from "react";
import "./styles.css";

type AlertTitleProps = HTMLAttributes<HTMLDivElement>;

function AlertTitle(props: AlertTitleProps) {
  const { className: baseClassName, ...rest } = props;
  const className = `arkynAlertTitle ${baseClassName}`;

  return <div className={className.trim()} {...rest} />;
}

export { AlertTitle };
