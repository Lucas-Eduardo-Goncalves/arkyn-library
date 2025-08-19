import { DrawerContextProps } from "@arkyn/types";
import { createContext } from "react";

const DrawerContext = createContext<DrawerContextProps>(
  {} as DrawerContextProps
);

export { DrawerContext };
