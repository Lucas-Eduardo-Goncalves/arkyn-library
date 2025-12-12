import {
  createContext,
  HTMLAttributes,
  JSX,
  ReactNode,
  useContext,
} from "react";
import { AlertTitle } from "../alertTitle";
import "./styles.css";

/**
 * @typedef {Object} AlertContainerProps
 * @property {"success" | "danger" | "warning" | "info"} schema - The visual style schema for the alert (success: green, danger: red, warning: yellow, info: blue)
 * @property {ReactNode} children - The content to be displayed inside the alert container
 * @property {string} [className] - Optional additional CSS classes to apply to the container
 * @extends {HTMLAttributes<HTMLDivElement>}
 */
type AlertContainerProps = {
  schema: "success" | "danger" | "warning" | "info";
} & HTMLAttributes<HTMLDivElement>;

/**
 * Context for sharing alert container properties with child components
 * @internal
 */
const AlertContainerContext = createContext({} as AlertContainerProps);

/**
 * Custom hook to access the AlertContainer context
 *
 * @returns {AlertContainerProps} The current alert container properties including schema and HTML attributes
 *
 * @example
 * function CustomAlertContent() {
 *   const { schema } = useAlertContainer();
 *   return <div>Current schema: {schema}</div>;
 * }
 */
function useAlertContainer(): AlertContainerProps {
  return useContext(AlertContainerContext);
}

/**
 * AlertContainer - A flexible alert component that displays messages with different visual styles
 *
 * This component automatically adjusts its layout based on whether an AlertTitle component
 * is present among its children. When AlertTitle is detected, the content is left-aligned;
 * otherwise, it's centered.
 *
 * @component
 * @memberof Alert
 *
 * @param {AlertContainerProps} props - Component properties
 * @param {"success" | "danger" | "warning" | "info"} props.schema - Determines the visual styling and semantic meaning of the alert
 * @param {ReactNode} props.children - Content to be rendered inside the alert, can include AlertTitle and other components
 * @param {string} [props.className] - Additional CSS classes to customize the alert appearance
 *
 * @returns {JSX.Element} A styled alert container with context provider for child components
 *
 * @requires react - For createContext, useContext, ReactNode
 *
 * @example
 * // Basic usage
 * <AlertContainer schema="success">
 *  {children}
 * </AlertContainer>
 *
 * @example
 * // Complete alert example
 * <AlertContainer schema="success">
 *  <AlertIcon />
 *  <AlertContent>
 *    <AlertTitle>Success!</AlertTitle>
 *    <AlertDescription>
 *      You are premium user now!
 *    </AlertDescription>
 *  </AlertContent>
 * </AlertContainer>
 */

function AlertContainer(props: AlertContainerProps): JSX.Element {
  const { schema, children, className: baseClassName, ...rest } = props;

  const hasAlertTitle = (children: ReactNode): boolean => {
    let found = false;
    const searchForAlertTitle = (nodes: ReactNode) => {
      if (Array.isArray(nodes)) {
        nodes.forEach(searchForAlertTitle);
      } else if (nodes && typeof nodes === "object" && "type" in nodes) {
        if (nodes.type === AlertTitle) {
          found = true;
        } else if (
          nodes.props &&
          typeof nodes.props === "object" &&
          nodes.props !== null &&
          "children" in nodes.props
        ) {
          searchForAlertTitle((nodes.props as any).children);
        }
      }
    };
    searchForAlertTitle(children);
    return found;
  };

  const shouldAlignCenter = !hasAlertTitle(children);
  const finalClassName = shouldAlignCenter
    ? "nonExistsAlertTitle"
    : "existsAlertTitle";

  const className = `arkynAlertContainer ${schema} ${finalClassName} ${baseClassName}`;

  return (
    <AlertContainerContext.Provider value={props}>
      <div className={className.trim()} {...rest}>
        {children}
      </div>
    </AlertContainerContext.Provider>
  );
}

export { AlertContainer, useAlertContainer };
