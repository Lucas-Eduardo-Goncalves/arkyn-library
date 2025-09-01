import { LucideIcon } from "lucide-react";

type IconRendererProps = {
  iconSize: number;
  className?: string;
  icon?: LucideIcon | string;
  show?: boolean;
};

function IconRenderer(props: IconRendererProps) {
  const { iconSize, icon: Icon, className, show = true } = props;

  if (!show) return <></>;
  if (!Icon) return <></>;

  if (typeof Icon === "string") {
    return <p className={className}>{Icon}</p>;
  }

  return (
    <p className={className}>
      <Icon size={iconSize} strokeWidth={2.5} />
    </p>
  );
}

export { IconRenderer };
