import { createContext, ReactNode, useContext, useState } from "react";

type RadioGroupContextType = {
  value: string;
  isError: boolean;
  size: "sm" | "md" | "lg";
  handleChange: (value: string) => void;
  disabled: boolean;
};

type RadioProviderProps = {
  children: ReactNode;
  isError: boolean;
  size: "sm" | "md" | "lg";
  value: string;
  handleChange: (value: string) => void;
  disabled: boolean;
};

const radioContext = createContext({} as RadioGroupContextType);

function RadioProvider(props: RadioProviderProps) {
  const { children, size, isError, handleChange, value, disabled } = props;

  return (
    <radioContext.Provider
      value={{ handleChange, value, size, isError, disabled }}
    >
      {children}
    </radioContext.Provider>
  );
}

function useRadioGroup() {
  return useContext(radioContext);
}

export { RadioProvider, useRadioGroup };
