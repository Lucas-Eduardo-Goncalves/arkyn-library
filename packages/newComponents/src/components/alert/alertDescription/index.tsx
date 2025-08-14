import { HTMLAttributes } from "react";
import "./styles.css";

type AlertDescriptionProps = HTMLAttributes<HTMLDivElement>;

function AlertDescription(props: AlertDescriptionProps) {
  const { className: baseClassName, ...rest } = props;
  const className = `arkynAlertDescription ${baseClassName}`;

  return <div className={className.trim()} {...rest} />;
}

export { AlertDescription };
