import { createContext, ReactNode, useContext, useState } from "react";

type RadioGroupContextType = {
  value: string;
  isError: boolean;
  size: "sm" | "md" | "lg";
  handleChange: (value: string) => void;
};

type RadioProviderProps = {
  children: ReactNode;
  isError: boolean;
  size: "sm" | "md" | "lg";
  value: string;
  handleChange: (value: string) => void;
};

const radioContext = createContext({} as RadioGroupContextType);

function RadioProvider(props: RadioProviderProps) {
  const { children, size, isError, handleChange, value } = props;

  return (
    <radioContext.Provider value={{ handleChange, value, size, isError }}>
      {children}
    </radioContext.Provider>
  );
}

function useRadioGroup() {
  return useContext(radioContext);
}

export { RadioProvider, useRadioGroup };
