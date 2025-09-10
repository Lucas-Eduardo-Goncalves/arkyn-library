import { InputMask } from "@react-input/mask";
import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useState,
} from "react";

import {
  applyMask,
  clear,
  getMask,
  MAX_LENGTH,
  TYPES,
} from "../../../utils/phoneInputUtilities";

import "./style.css";

type CountryType = {
  name: string;
  code: string;
  iso: string;
  prefix: null | string;
  flag: string;
  mask: string;
};

type PhoneInputMaskProps = {
  onFocus: () => void;
  onBlur: () => void;
  disabled: boolean;
  readonly: boolean;
  size: "md" | "lg";
  currentCountry: CountryType;
  value: string;
  onChange: (e: string) => void;
  id: string;
};

const BaseInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return <input ref={ref} {...props} />;
});

const PhoneInputMask = forwardRef<HTMLInputElement, PhoneInputMaskProps>(
  (props, ref) => {
    const {
      onFocus,
      readonly,
      onBlur,
      size,
      onChange,
      value,
      currentCountry,
      disabled,
      id,
    } = props;

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      if (isMounted) onChange(currentCountry.mask);
      else setIsMounted(true);
    }, [currentCountry]);

    const className = `phoneInputMask ${size}`;

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      let value = clear(event.target.value);
      const mask = getMask(value);

      let nextLength = value.length;
      if (nextLength > MAX_LENGTH) return;

      value = applyMask(value, TYPES[mask] as "EIGHT" | "NINE");
      event.target.value = value;

      onChange(value);
    }

    if (currentCountry.code === "+55") {
      return (
        <input
          id={id}
          value={value}
          onChange={handleChange}
          className={className}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          ref={ref}
        />
      );
    }

    return (
      <InputMask
        id={id}
        value={value}
        readOnly={readonly}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        component={BaseInput}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        mask={currentCountry.mask}
        showMask
        replacement={{ _: /\d/ }}
        ref={ref}
      />
    );
  }
);

export { PhoneInputMask };
