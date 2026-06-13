import {
  HTMLAttributes,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import "./styles.css";

type TooltipProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Text rendered inside the tooltip bubble. Supports inline HTML. Required. */
  text: string;
  /** Element that triggers the tooltip on hover. Required. */
  children: ReactNode;
  /**
   * Preferred position of the tooltip relative to the trigger element.
   * Automatically flips to the opposite side if the tooltip would overflow the viewport.
   * @default "top"
   */
  orientation?: "top" | "right" | "bottom" | "left";
  /**
   * Tooltip size.
   * @default "lg"
   */
  size?: "md" | "lg";
};

/**
 * Tooltip — shows a contextual text bubble on hover with smart viewport-aware positioning.
 *
 * The tooltip automatically flips to the opposite side when it would overflow the viewport.
 *
 * @param props.text - Text (or HTML) to display in the tooltip. Required.
 * @param props.children - Trigger element. Required.
 * @param props.orientation - Preferred position relative to the trigger. Default: "top"
 * @param props.size - Tooltip size. Default: "lg"
 *
 * **...Other valid HTML properties for `<div>`**
 *
 * @returns Tooltip JSX element.
 *
 * @example
 * ```tsx
 * <Tooltip text="Save changes before leaving">
 *   <IconButton icon={SaveIcon} aria-label="Save" />
 * </Tooltip>
 *
 * // Toolbar with bottom-oriented tooltips
 * <Tooltip text="Add item" orientation="bottom">
 *   <IconButton icon={Plus} aria-label="Add" />
 * </Tooltip>
 *
 * <Tooltip text="Delete" orientation="bottom" size="md">
 *   <IconButton icon={Trash2} aria-label="Delete" scheme="danger" />
 * </Tooltip>
 * ```
 */

function Tooltip(props: TooltipProps) {
  const {
    text,
    size = "lg",
    children,
    orientation = "top",
    className: baseClassName = "",
    ...rest
  } = props;

  const tooltipId = useId();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjustedOrientation, setAdjustedOrientation] = useState(orientation);

  useEffect(() => {
    const checkTooltipPosition = () => {
      if (!tooltipRef.current) return;
      const tooltipText = document.getElementById(tooltipId) as HTMLElement;
      if (!tooltipText) return;

      setAdjustedOrientation(orientation);

      requestAnimationFrame(() => {
        const rect = tooltipText.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newOrientation = orientation;

        if (orientation === "left" && rect.left < 0) {
          newOrientation = "right";
        } else if (orientation === "right" && rect.right > viewportWidth) {
          newOrientation = "left";
        } else if (orientation === "top" && rect.top < 0) {
          newOrientation = "bottom";
        } else if (orientation === "bottom" && rect.bottom > viewportHeight) {
          newOrientation = "top";
        }

        if (newOrientation === "right" && rect.right > viewportWidth) {
          newOrientation = "left";
        } else if (newOrientation === "left" && rect.left < 0) {
          newOrientation = "right";
        } else if (
          newOrientation === "bottom" &&
          rect.bottom > viewportHeight
        ) {
          newOrientation = "top";
        } else if (newOrientation === "top" && rect.top < 0) {
          newOrientation = "bottom";
        }

        setAdjustedOrientation(newOrientation);
      });
    };

    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const handleMouseEnter = () => {
      setTimeout(checkTooltipPosition, 1);
    };

    tooltip.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("resize", checkTooltipPosition);

    return () => {
      tooltip.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("resize", checkTooltipPosition);
    };
  }, [orientation, tooltipId]);

  const className = `arkynTooltip ${size} ${adjustedOrientation} ${baseClassName}`;

  return (
    <div className={className.trim()} {...rest} ref={tooltipRef}>
      {children}

      <div
        className="arkynTooltipText"
        id={tooltipId}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}

export { Tooltip };
