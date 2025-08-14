import { HTMLAttributes } from "react";
import "./styles.css";

type AlertContentProps = HTMLAttributes<HTMLDivElement>;

function AlertContent(props: AlertContentProps) {
  const { className: baseClassName, ...rest } = props;
  const className = `arkynAlertContent ${baseClassName}`;

  return <div className={className.trim()} {...rest} />;
}

export { AlertContent };
