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
  text: string;
  children: ReactNode;
  orientation?: "top" | "right" | "bottom" | "left";
  size?: "md" | "lg";
};

/**
 * Tooltip component - displays contextual information on hover with smart positioning
 *
 * @param props - Tooltip component properties
 * @param props.text - Text content to display in the tooltip
 * @param props.children - Element that triggers the tooltip on hover
 * @param props.orientation - Preferred tooltip position relative to trigger element. Default: "top"
 * @param props.size - Tooltip size variant. Default: "lg"
 *
 * **...Other valid HTML properties for div element**
 *
 * @returns Tooltip JSX element
 *
 * @example
 * ```tsx
 * // Basic tooltip
 * <Tooltip text="This is a helpful tip">
 *   <button>Hover me</button>
 * </Tooltip>
 *
 * // Tooltip with different orientations
 * <Tooltip text="Left tooltip" orientation="left">
 *   <span>Hover for left tooltip</span>
 * </Tooltip>
 *
 * <Tooltip text="Right tooltip" orientation="right">
 *   <span>Hover for right tooltip</span>
 * </Tooltip>
 *
 * // Different sizes
 * <Tooltip text="Small tooltip" size="md">
 *   <button>Small tooltip</button>
 * </Tooltip>
 *
 * <Tooltip text="Large tooltip" size="lg">
 *   <button>Large tooltip</button>
 * </Tooltip>
 *
 * // Smart positioning - automatically adjusts if doesn't fit
 * <Tooltip text="This tooltip will auto-adjust position" orientation="left">
 *   <button className="near-edge">Smart positioning</button>
 * </Tooltip>
 *
 * // Complete example with custom styling
 * <Tooltip
 *   text="Save your changes before proceeding"
 *   orientation="bottom"
 *   size="lg"
 *   className="custom-tooltip"
 * >
 *   <IconButton icon={SaveIcon} />
 * </Tooltip>
 *
 * // Multiple tooltips on same page
 * <div className="toolbar">
 *   <Tooltip text="Create new file" orientation="bottom">
 *     <IconButton icon={PlusIcon} />
 *   </Tooltip>
 *
 *   <Tooltip text="Open existing file" orientation="bottom">
 *     <IconButton icon={FolderIcon} />
 *   </Tooltip>
 *
 *   <Tooltip text="Delete selected file" orientation="bottom">
 *     <IconButton icon={TrashIcon} />
 *   </Tooltip>
 * </div>
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
