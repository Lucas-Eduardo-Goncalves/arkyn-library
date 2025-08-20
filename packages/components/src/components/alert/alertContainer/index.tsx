import { createContext, HTMLAttributes, ReactNode, useContext } from "react";
import { AlertTitle } from "../alertTitle";
import "./styles.css";

type AlertContainerProps = {
  schema: "success" | "danger" | "warning" | "info";
} & HTMLAttributes<HTMLDivElement>;

const AlertContainerContext = createContext({} as AlertContainerProps);

function useAlertContainer() {
  return useContext(AlertContainerContext);
}

/**
 * AlertContainer component - used to display alert messages with different schemas
 *
 * @param props - AlertContainer component properties
 * @param props.schema - Alert color scheme and semantic meaning: "success" | "danger" | "warning" | "info"
 *
 * **...Other valid HTML properties for div**
 *
 * @returns AlertContainer JSX element with context provider
 *
 * @example
 * ```tsx
 * // Basic alert
 * <AlertContainer schema="info">
 *   Alert message content
 * </AlertContainer>
 *
 * // Success alert
 * <AlertContainer schema="success">
 *   Operation completed successfully!
 * </AlertContainer>
 *
 * // Alert with title
 * <AlertContainer schema="warning">
 *   <AlertTitle>Warning</AlertTitle>
 *   Please check your input data.
 * </AlertContainer>
 *
 * // Danger alert
 * <AlertContainer schema="danger">
 *   <AlertTitle>Error</AlertTitle>
 *   Something went wrong. Please try again.
 * </AlertContainer>
 * ```
 */

function AlertContainer(props: AlertContainerProps) {
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
